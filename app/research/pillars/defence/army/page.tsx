import type { Metadata } from 'next';
import { ServiceAtlasShell, serviceMetadata } from '../ServiceAtlasShell';

export const metadata: Metadata = serviceMetadata('army');

export default function ArmyAtlasPage() {
  return <ServiceAtlasShell view="army" />;
}
