import LoadingLogo from '~/components/LoadingLogo';

const PageLoader = (label: string) => () => (
  <div className='flex flex-col items-center gap-2'>
    <LoadingLogo />
    <p className='text-md italic'>{`Laster inn ${label}...`}</p>
  </div>
);

export default PageLoader;
