import Navbar from '@/components/Navbar';
import MainContent from '@/components/MainContent';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <MainContent>{children}</MainContent>
    </>
  );
}
