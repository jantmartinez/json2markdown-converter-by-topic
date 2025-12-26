import fs from 'fs';
import doc from './src/assets/docs/doc.json';
import { jsonToMarkdown } from './src/utils';

const topic = process.argv[2];
const output = process.argv[3] || `${topic}.md`;

if (!topic) {
  console.error('Usage: bun generate-topic.ts <topic> [output]');
  process.exit(1);
}

const topicData = doc[topic as keyof typeof doc];

if (!topicData) {
  console.error(`Error: Topic "${topic}" not found in doc.json`);
  process.exit(1);
}

const markdown = jsonToMarkdown({ [topic]: topicData });

fs.writeFileSync(output, markdown);

console.debug(`Successfully generated ${output} for topic "${topic}"`);
