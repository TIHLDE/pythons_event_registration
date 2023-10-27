import { Link as ExternalLink } from '@nextui-org/link';
import Image from 'next/image';
import Link from 'next/link';

import { getSignedInUser } from '~/functions/getUser';

const NavBar = async () => {
  const user = await getSignedInUser();
  return (
    <div className='mb-6 flex flex-col gap-4'>
      <div className='flex justify-between gap-4'>
        <h3 className='text-md font-cabin'>{user ? `🏋️‍♂️ ${user.name}` : `Du er ikke innlogget`}</h3>
        <ExternalLink className='text-md font-cabin text-white' href='https://tihlde.org/grupper/pythons-gutter-a/boter/' isExternal showAnchorIcon>
          Botinnmelding
        </ExternalLink>
      </div>
      <div className='flex items-center justify-center'>
        <Link href='/'>
          <Image alt='Logo' height={75.25} src='/pythons.png' width={50} />
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
