import type { Metadata } from 'next';
import { ServiceAtlasShell, serviceMetadata } from '../ServiceAtlasShell';

export const metadata: Metadata = serviceMetadata('maritime');

export default function NavyCoastGuardAtlasPage() {
  return <ServiceAtlasShell view="maritime" />;
}
