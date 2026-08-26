import type { Metadata } from 'next';
import { ServiceAtlasShell, serviceMetadata } from '../ServiceAtlasShell';

export const metadata: Metadata = serviceMetadata('air_force');

export default function AirForceAtlasPage() {
  return <ServiceAtlasShell view="air_force" />;
}
