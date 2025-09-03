import { Filed } from '@/shared/ui/Filed';

export default function Home() {
  return (
    <div className={'container flex justify-center items-center size-full flex-col'}>
      <h1 className={'mb-6 text-white text-3xl font-bold'}>Морской boy</h1>
      <Filed />
    </div>
  );
}
