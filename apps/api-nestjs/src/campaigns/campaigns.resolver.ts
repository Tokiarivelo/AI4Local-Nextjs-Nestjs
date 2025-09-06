import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CampaignsService } from './campaigns.service';
import { Campaign } from '../entities/campaign.entity';
import { CreateCampaignInput } from './dto/create-campaign.input';
import { UpdateCampaignInput } from './dto/update-campaign.input';
import { GenerateContentInput } from './dto/generate-content.input';

@Resolver(() => Campaign)
@UseGuards(JwtAuthGuard)
export class CampaignsResolver {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Query(() => [Campaign], { name: 'campaigns' })
  findAll() {
    return this.campaignsService.findAll();
  }

  @Query(() => [Campaign], { name: 'campaignsByOrganization' })
  findByOrganization(@Args('organizationId', { type: () => Int }) organizationId: number) {
    return this.campaignsService.findByOrganization(organizationId);
  }

  @Query(() => Campaign, { name: 'campaign' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.campaignsService.findOne(id);
  }

  @Mutation(() => Campaign)
  createCampaign(@Args('input') createCampaignInput: CreateCampaignInput) {
    return this.campaignsService.create(createCampaignInput);
  }

  @Mutation(() => Campaign)
  updateCampaign(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateCampaignInput: UpdateCampaignInput,
  ) {
    return this.campaignsService.update(id, updateCampaignInput);
  }

  @Mutation(() => Boolean)
  removeCampaign(@Args('id', { type: () => Int }) id: number) {
    return this.campaignsService.remove(id);
  }

  @Mutation(() => String)
  generateContent(@Args('input') generateContentInput: GenerateContentInput) {
    return this.campaignsService.generateContent(generateContentInput);
  }
}

