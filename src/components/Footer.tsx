import { Divider } from '@nextui-org/divider';
import { Link } from '@nextui-org/link';

import { getSignedInUser } from '~/functions/getUser';

export const Footer = async () => {
  const user = await getSignedInUser();
  return (
    <div className='mx-0 mt-8 flex flex-col gap-4'>
      <Divider />
      <p className='text-md text-center'>
        <Link color='secondary' href='https://github.com/TIHLDE/pythons_event_registration/issues/new' isExternal size='md' underline='always'>
          Funnet en bug?
        </Link>
        {`  •  `}
        <Link color='secondary' href='https://github.com/TIHLDE/pythons_event_registration' isExternal size='md' underline='always'>
          Kildekode
        </Link>
        {user && (
          <>
            {`  •  `}
            <Link color='secondary' href='/api/auth/logout' size='md' underline='always'>
              Logg ut
            </Link>
          </>
        )}
      </p>
      <p className='text-md text-center'>
        {'Laget med ⚽️ av '}
        <Link color='secondary' href='https://github.com/olros' isExternal size='md' underline='always'>
          Olaf Rosendahl
        </Link>
        {' og '}
        <Link color='secondary' href='https://github.com/maxschau' isExternal size='md' underline='always'>
          Max Torre Schau
        </Link>
      </p>
    </div>
  );
};
