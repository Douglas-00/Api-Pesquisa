import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { parseAsync } from 'json2csv';
import { AppLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class ExportSearchResponsesToCsvUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async execute(searchId: number): Promise<string> {
    const search = await this.prisma.search.findUnique({
      where: { id: searchId },
    });

    if (!search) {
      this.logger.warn(`Search with ID ${searchId} not found`);
      throw new NotFoundException('Search not found');
    }

    const responses = await this.prisma.searchResponse.findMany({
      where: { searchId },
      include: {
        questionResponses: {
          include: { searchQuestion: true },
        },
      },
    });

    this.logger.log(
      `Fetched ${responses.length} responses for search ID ${searchId} for CSV export`,
    );

    const csvData = responses
      .map((response) => {
        return response.questionResponses.map((qr) => ({
          responseId: response.id,
          targetAudience: response.targetAudience,
          stars: response.stars,
          contactEmail: response.contactEmail,
          question: qr.searchQuestion.name,
          answer: qr.answer,
        }));
      })
      .flat();

    const fields = [
      { label: 'Response ID', value: 'responseId' },
      { label: 'Target Audience', value: 'targetAudience' },
      { label: 'Stars', value: 'stars' },
      { label: 'Contact Email', value: 'contactEmail' },
      { label: 'Question', value: 'question' },
      { label: 'Answer', value: 'answer' },
    ];

    const options = { fields, withBOM: true };

    try {
      const csv = await parseAsync(csvData, options);
      this.logger.log(`Successfully generated CSV for search ID ${searchId}`);
      return csv;
    } catch (error) {
      this.logger.error(
        `Failed to generate CSV for search ID ${searchId}: ${error.message}`,
      );
      throw new Error(`Failed to generate CSV: ${error}`);
    }
  }
}

export default ExportSearchResponsesToCsvUseCase;
