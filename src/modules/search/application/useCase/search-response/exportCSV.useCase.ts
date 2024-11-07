import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { parseAsync } from 'json2csv';

@Injectable()
export class ExportSearchResponsesToCsvUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(searchId: number): Promise<string> {
    const search = await this.prisma.search.findUnique({
      where: { id: searchId },
    });

    if (!search) {
      throw new NotFoundException('Search not found');
    }

    const responses = await this.prisma.searchResponse.findMany({
      where: { searchId },
      include: {
        questionResponses: {
          include: {
            searchQuestion: true,
          },
        },
      },
    });

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

    const options = {
      fields,
      withBOM: true,
    };

    let csv = '';

    try {
      csv = await parseAsync(csvData, options);
      return csv;
    } catch (error) {
      throw new Error(`'Failed to generate CSV: ${error}`);
    }
  }
}
