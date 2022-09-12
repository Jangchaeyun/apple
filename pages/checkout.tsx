import Head from 'next/head';
import { useSelector } from 'react-redux';
import Header from "../components/Header";
import Button from '../components/Button';
import { selectBasketItems, selectBasketTotal } from '../redux/basketSlice';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Stripe from 'stripe';
import Currency from "react-currency-formatter";
import CheckoutProduct from '../components/CheckoutProduct';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { fetchPostJSON } from '../utils/api-helpers';
import getStripe from "../utils/get-stripejs";

function Checkout() {
    const items = useSelector(selectBasketItems);
    const basketTotal = useSelector(selectBasketTotal);
    const router = useRouter();
    const [groupedItemsInBasket, setGroupedItemInBasket] = useState(
        {} as { [key: string]: Product[] }
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const groupedItems = items.reduce((results, item) => {
            (results[item._id] = results[item._id] || []).push(item);
            return results;
        }, {} as { [key: string]: Product[] });
  
        setGroupedItemInBasket(groupedItems);
    }, [items]);

    const createCheckoutSession = async () => {
      setLoading(true);

      const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON("/api/checkout_sessions",
        {
          items: items,
        }
      );

      if ((checkoutSession as any).statusCode === 500) {
        console.error((checkoutSession as any).message);
        return;
      }

      // Redirect to checkout
      const stripe = await getStripe()
      const { error } = await stripe!.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: checkoutSession.id,
      });

      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `error.message`.
      console.warn(error.message);

      setLoading(false);
    };

  return (
    <div className='main-h-screen overflow-hidden bg-[#E7ECEE]'>
      <Head>
        <title>장바구니 - Apple</title>
        <link rel="icon" ref="/favicon .ico" />
      </Head>
      <Header />
      <main className='mx-auto max-w-5xl pb-24'>
        <div className='px-5'>
            <h1 className='my-4 text-3xl font-semibold lg:text-4xl'>
                {items.length > 0 ? "장바구니" : "장바구니가 비었습니다."}
            </h1>
            <p className='my-4'>무료 배송 및 무료 반품</p>

            {items.length === 0 && (
                <Button 
                    title="쇼핑 계속하기"
                    onClick={() => router.push("/")}
                />
            )}
        </div>
        {items.length > 0 && (
            <div className='mx-5 md:mx-8'>
              {Object.entries(groupedItemsInBasket).map(([key, items]) => (
                <CheckoutProduct key={key} items={items} id={key} />
              ))}
              <div className='my-12 mt-6 ml-auto max-w-3xl'>
                <div className="divide-y divide-gray-300">
                  <div className='pb-4'>
                    <div className='flex justify-between'>
                      <p>소계</p>
                      <p>
                        <Currency quantity={basketTotal} currency="USD" />
                      </p>
                    </div>
                    <div className='flex justify-between'>
                      <p>배송비</p>
                      <p>무료</p>
                    </div>
                    <div className='flex justify-between'>
                      <div className='flex flex-col gap-x-1 lg:flex-row'>
                        예상 세금: {" "}
                        <p className='flex cursor-pointer items-end text-blue-500 hpver:underline'>
                          우편번호
                          <ChevronDownIcon className='h-6 w-6' />
                        </p>
                      </div>
                      <p>~ 원</p>
                    </div>
                  </div>
                  <div className='flex justify-between pt-4 text-xl font-semibold'>
                    <h4>총 금액</h4>
                    <h4>
                      <Currency quantity={basketTotal} currency="USD" />
                    </h4>
                  </div>
                </div>
                <div className='my-14 spay-y-4'>
                  <h4 className='text-xl font-semibold'>
                    어떻게 결제하시겠습니까?
                  </h4>
                  <div className='flex flex-col gap-4 md:flex-row'>
                    <div className='order-2 flex flex-1 flex-col items-center rounded-xl 
                    bg-gray-200 p-8 py-12 text-center'>
                      <h4 className='mb-4 flex flex-col text-xl font-semibold'>
                        <span>매월 지불</span>
                        <span>애플 카드로</span>
                        <span>
                          $283.94/월 연이율 0%에서<sup className='-top-1'>◊</sup>
                        </span>
                      </h4>
                      <Button title="Apple Card 월 할부로 결제" />
                      <p className='mt-2 max-w-[240px] text-[13px]'>
                        적용 가능한 정가 품목, 계약금, 배송료 및 세금을 포함하여 오늘 $0.00 납부해야 합니다.
                      </p>
                    </div>
                    <div className='flex flex-1 flex-col items-center space-y-8 rounded-xl bg-gray-200 p-8 py-12 md:order-2'>
                      <h4 className="mb-4 flex flex-col text-xl font-semibold">
                        전액 지불
                        <span>
                          <Currency quantity={basketTotal} currency="USD" />
                        </span>
                      </h4>
                      <Button
                        noIcon
                        loading={loading}
                        title="결제"
                        width='w-full'
                        onClick={createCheckoutSession}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </main>
    </div>
  );
}

export default Checkout;
