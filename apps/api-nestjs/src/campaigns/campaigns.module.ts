import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CampaignsService } from './campaigns.service';
import { CampaignsResolver } from './campaigns.resolver';
import { Campaign } from '../entities/campaign.entity';
import { Organization } from '../entities/organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, Organization]),
    HttpModule,
  ],
  providers: [CampaignsService, CampaignsResolver],
})
export class CampaignsModule {}

