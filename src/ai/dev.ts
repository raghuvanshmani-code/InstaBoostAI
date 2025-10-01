import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-content.ts';
import '@/ai/flows/generate-post-suggestions';
import '@/ai/flows/suggest-relevant-hashtags.ts';
import '@/ai/flows/generate-instagram-caption.ts';
