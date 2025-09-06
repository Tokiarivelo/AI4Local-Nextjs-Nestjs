import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Campaign } from '../entities/campaign.entity';
import { Organization } from '../entities/organization.entity';
import { CreateCampaignInput } from './dto/create-campaign.input';
import { UpdateCampaignInput } from './dto/update-campaign.input';
import { GenerateContentInput } from './dto/generate-content.input';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private httpService: HttpService,
  ) {}

  async findAll(): Promise<Campaign[]> {
    return this.campaignRepository.find({
      relations: ['organization'],
    });
  }

  async findByOrganization(organizationId: number): Promise<Campaign[]> {
    return this.campaignRepository.find({
      where: { organizationId },
      relations: ['organization'],
    });
  }

  async findOne(id: number): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['organization'],
    });

    if (!campaign) {
      throw new NotFoundException(`Campagne avec l'ID ${id} non trouvée`);
    }

    return campaign;
  }

  async create(createCampaignInput: CreateCampaignInput): Promise<Campaign> {
    const { organizationId, ...campaignData } = createCampaignInput;

    // Vérifier que l'organisation existe
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException(`Organisation avec l'ID ${organizationId} non trouvée`);
    }

    const campaign = this.campaignRepository.create({
      ...campaignData,
      organizationId,
    });

    return this.campaignRepository.save(campaign);
  }

  async update(id: number, updateCampaignInput: UpdateCampaignInput): Promise<Campaign> {
    const campaign = await this.findOne(id);

    Object.assign(campaign, updateCampaignInput);

    return this.campaignRepository.save(campaign);
  }

  async remove(id: number): Promise<boolean> {
    const campaign = await this.findOne(id);
    await this.campaignRepository.remove(campaign);
    return true;
  }

  async generateContent(generateContentInput: GenerateContentInput): Promise<string> {
    const { prompt, type } = generateContentInput;

    try {
      // Appel au service AI FastAPI
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:8000/generate-text', {
          prompt: `Créez un contenu de ${type} pour: ${prompt}`,
          max_tokens: 200,
        })
      );

      return response.data.generated_text;
    } catch (error) {
      console.error('Erreur lors de la génération de contenu:', error);
      throw new Error('Impossible de générer le contenu avec l\'IA');
    }
  }
}

