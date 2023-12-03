import { Link as ExternalLink } from '@nextui-org/link';
import Image from 'next/image';
import Link from 'next/link';

import { getSignedInUser } from '~/functions/getUser';

import img from '~/static/images/pythons.png';
import { ACTIVE_CLUB } from '~/values';

const NavBar = async () => {
  const user = await getSignedInUser();
  return (
    <div className='mb-6 flex flex-col gap-2'>
      <div className='flex justify-between gap-4'>
        <h3 className='text-md font-cabin'>{user ? `🏋️‍♂️ ${user.name}` : `Du er ikke innlogget`}</h3>
        <ExternalLink
          className='text-md font-cabin text-white'
          href={`https://tihlde.org/grupper/${ACTIVE_CLUB.pythonsGroupSlug}/boter/`}
          isExternal
          showAnchorIcon>
          Botinnmelding
        </ExternalLink>
      </div>
      <div className='flex items-center justify-center'>
        <Link href='/'>
          <Image alt='Logo' height={75} src={img} width={50} />
        </Link>
      </div>
      <h2 className='text-center font-oswald text-2xl font-bold'>{ACTIVE_CLUB.name}</h2>
    </div>
  );
};

export default NavBar;
