import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

import { 
  SearchIcon,
  ShoppingBagIcon,
  UserItem,
} from '@heroicons/react/outline';

function Header() {
  return (
    <header className='sticky top-0 z-30 flex w-full items-center justify-between bg-[#E7ECEE] p-4'>
      <div className='flex items-center justify-center md:w-1/5'>
        <Link href="/">
          <div className="relative w-5 cursor-pointer opacity-75 h-10 transition
          hover:opacity-100 ">
            <Image
                src="https://rb.gy/vsvv2o"
                layout='fill'
                objectFit='contain'
            />
          </div>
        </Link>
      </div>
      <div className='hidden flex-1 items-center justify-center space-x-10 md:flex'>
        <a className="headerLink">제품</a>
        <a className="headerLink">살펴보기</a>
        <a className="headerLink">지원</a>
        <a className="headerLink">비지니스</a>
      </div>
      <div className=''>
        <SearchIcon className="headerLink"/>
      </div>
    </header>
  );
}

export default Header
