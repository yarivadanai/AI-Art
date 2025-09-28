import type { Metadata } from 'next';
import { AboutContent } from './AboutContent';

export const metadata: Metadata = {
  title: 'About the Artwork — HIT-ARC',
  description:
    'Learn how the Authority evaluates human intelligence, why the constraints exist, and the artistic intent behind HIT-ARC.',
};

export default function AboutPage() {
  return <AboutContent />;
}
