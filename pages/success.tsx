import {CheckIcon, ChevronDownIcon, ChevronUpIcon, ShoppingCartIcon} from '@heroicons/react/outline';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import Button from '../components/Button';
import Currency from "react-currency-formatter";
import { GetServerSideProps } from 'next';
import { fetchLineItems } from '../utils/fetchLineItems';

interface Props {
    products: StripeProduct[]
}

function Success({ products } : Props) {
    console.log(products);
    const router = useRouter();
    const {session_id} = router.query;
    const [mounted, setMounted] = useState(false);
    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const subtotal = products.reduce(
        (acc, product) => acc + product.price.unit_amount / 100,
        0
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    // shadowOrderSummary always true for desktop but only conditionally true for
    // mobile
    const isTabletOrMobile = useMediaQuery({query: "(max-width: 1024px)"});
    const showOrderSummaryCondition = isTabletOrMobile
        ? showOrderSummary
        : true;
    
    const handleShowOrderSummary = () => {
        setShowOrderSummary(!showOrderSummary);
    }

    return (
        <div>
            <Head>
                <title>Thank You! - Apple</title>
                <link rel="stylesheet" href="/favicon.ico"/>
            </Head>
            <header className='mx-auto max-w-xl'>
                <Link href="/">
                    <div className='relative ml-4 h-16 w-8 cursor-pointer transition lg:hidden'>
                        <Image src="https://rb.gy/vsvv2o" layout="fill" objectFit="contain"/>
                    </div>
                </Link>
            </header>
            <main className='grid grid-cols-1 lg:grid-cols-9'>
                <section
                    className='order-2 mx-auto max-w-xl pb-12 lg:col-span-5 lg:mx-0 lg:max-w-none lg:pr-16 lg:pt-16 xl:pl-16 2xl:pl-44'>
                    <Link href="/">
                        <div
                            className="relative ml-14 hidden h-24 w-12 cursor-pointer transition lg:inline-flex">
                            <Image src="https://rb.gy/vsvv20" layout="fill" objectFit="contain"/>
                        </div>
                    </Link>
                    <div className='my-8 ml-4 flex space-x-4 lg:ml-14 xl:ml-0'>
                        <div
                            className='flex h-11 w-11 items-center justify-center rounded-full border-2 border-black'>
                            <CheckIcon className='h-8 w-8'/>
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>주문 #{
                                    session_id
                                        ?.slice(-5)
                                }</p>
                            <h4>
                                감사합니다{" "}
                                {/* {session ? session.user?.name?.split(" ")[0] : "Guest"} */}
                            </h4>
                        </div>
                    </div>
                    <div
                        className='mx-4 divide-y divide-gray-300 rounded-md border border-gray-300 p-4 lg:ml-14'>
                        <div className='space-y-2 pb-3'>
                            <p>주문이 확인되었습니다.</p>
                            <p className='text-sm text-gray-600'>
                                귀하의 주문을 수락했으며 준비 중입니다. 배송 상태를 보려면 이 페이지를 새로고침하세요.
                            </p>
                        </div>
                        <div className='pt-3 text-sm'>
                            <p className='font-medium text-gray-600'>
                                송장 번호 :
                            </p>
                            <p>BH920506</p>
                        </div>
                    </div>
                    <div
                        className='my-4 mx-4 space-y-2 rounded-md border border-gary-300 p-4 lg:ml-14'>
                        <p>배송 업데이트</p>
                        <p className='text-sm text-gray-600'>
                            이메일과 문자로 배송 및 배송 업데이트를 받게 됩니다.
                        </p>
                    </div>
                    <div className='mx-4 flex flex-col items-center justify-between text-sm lg:ml-14 lg:flex-row'>
                        <p className='hidden lg:inline'>도와드릴까요? 연락주세요</p>
                        {
                            mounted && (
                                <Button
                                    title="쇼핑 계속하기"
                                    onClick={() => router.push("/")}
                                    width={isTabletOrMobile
                                        ? "w-full"
                                        : undefined}
                                    padding="py-4"/>
                            )
                        }
                    </div>
                </section>

                {
                    mounted && (
                        <section className="overflow-y-scroll border-y border-l border-gray-300 bg-[#FAFAFA] lg:order-2 lg:col-span-4 lg:h-screen lg:border-y-0">
                            <div className={`w-full ${showOrderSummaryCondition && "border-b"} border-gray-300 text-sm lg:hidden`}>
                                <div className='mx-auto flex max-w-xl items-center justify-between px-4 py-6'>
                                    <button onClick={handleShowOrderSummary} className="flex items-center space-x-2">
                                        <ShoppingCartIcon className='h-6 w-6'/>
                                        <p>주문 요약 표시</p>
                                        {
                                            showOrderSummaryCondition
                                                ? (<ChevronUpIcon className="h-4 w-4"/>)
                                                : (<ChevronDownIcon className='h-4 w-4'/>)
                                        }
                                    </button>

                                    <p className='text-xl font-medium text-black'>
                                        <Currency quantity={subtotal + 0} />
                                    </p>
                                </div>
                            </div>
                            {showOrderSummaryCondition && (
                                <div className='mx-auto max-w-xl divide-y border-gray-300 px-4 py-4 lg:mx-0 lg:max-w-lg lg:px-10 lg:py-16'>
                                    <div className='space-y-4 pb-4'>
                                        {products.map((product) => (
                                            <div key={product.id} className="flex items-center space-x-4 text-sm font-medium">
                                                <div className="relative flex h-16 w-16 items-center justify-center rounded-md border border-gray-300 bg-[#F1F1F1] text-xs text-white">
                                                    <div className='relative h-7 w-7 animate-bounce rounded-md'>
                                                        <Image
                                                            src="https://rb.gy/vsvv2o"
                                                            layout='fill'
                                                            objectFit='contain'
                                                        />
                                                    </div>
                                                    <div className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[gray] text-xs'>
                                                        {product.quantity}
                                                    </div>
                                                </div>
                                                <p className='flex-1'>{product.description}</p>
                                                <p>
                                                    <Currency
                                                        quantity={product.price.unit_amount / 100}
                                                        currency={product.currency}
                                                    />
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='space-y-1 py-4'>
                                        <div className='flex justify-between text-sm'>
                                            <p className='text-[gray]'>소계</p>
                                            <p className='font-medium'>
                                                <Currency quantity={subtotal} />
                                            </p>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <p className="text-[gray]">할인</p>
                                            <p className="text-[gray]"></p>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <p className="text-[gray]">배송비</p>
                                            <p className="font-medium">
                                            <Currency quantity={0} currency="USD" />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between pt-4">
                                        <p>Total</p>
                                        <p className="flex items-center gap-x-2 text-xs text-[gray]">
                                            USD
                                            <span className="text-xl font-medium text-black">
                                            <Currency quantity={subtotal + 0} />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </section>
                    )
                }
            </main>
        </div>
    );
}

export default Success;

export const getServerSideProps: GetServerSideProps<Props> = async ({query}) => {
    const sessionId = query.session_id as string
    const products = await fetchLineItems(sessionId)


    return  {
        props: {
            products,
        }
    }
}