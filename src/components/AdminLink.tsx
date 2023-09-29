import Link from 'next/link';

export type AdminLinkProps = {
  path: string;
  title: string;
  description: string;
  openInNewTab?: boolean;
};

const AdminLink = ({ path, title, description, openInNewTab }: AdminLinkProps) => {
  return (
    <Link
      className='flex h-full flex-col gap-2 rounded-md bg-primary-900 p-4 no-underline hover:bg-primary-800'
      href={path}
      target={openInNewTab ? '_blank' : undefined}>
      <h2 className='font-oswald text-3xl font-bold'>{title}</h2>
      <p className='text-md'>{description}</p>
    </Link>
  );
};

export default AdminLink;
