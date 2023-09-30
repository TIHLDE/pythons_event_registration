import { CircularProgress } from '@nextui-org/progress';

const LoadingLogo = ({ label }: { label?: string }) => (
  <div className='flex h-full w-full items-center justify-center'>
    <CircularProgress className='h-40 w-40' color='primary' label={label} size='lg' />
  </div>
);

export default LoadingLogo;
