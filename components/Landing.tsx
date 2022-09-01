import Image from 'next/image'
import React from 'react'
import Button from './Button'

function Landing() {
  return (
    <section className='sticky top-0 mx-auto flex h-screen max-w-[1350px] items-center
    justify-between px-8'>
        <div className="space-y-8">
            <h1 className='space-y-3 text-5xl font-semibold trackig-wide lg:text-6xl xl:text-7xl'>
                <span className="block bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text
                text-transparent">
                    일상을
                </span>
                <span className="block">위한 비상한</span>
                <span className="block">능력</span>
            </h1>
            <div className="space-x-8">
                <Button title="구입하기"/>
                <a className="link">더 알아보기</a>
            </div>
        </div>
        <div className='relative hidden h-[450px] w-[450px] transition-all duration-500
        md:inline lg:h-[650px] lg:w-[600px]'>
            <Image
                src="/iphone.png"
                layout='fill'
                objectFit='contain'
            />
        </div>
    </section>
  )
}

export default Landing
