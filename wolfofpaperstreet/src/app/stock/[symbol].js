import React from 'react';
import { useRouter } from 'next/router';
import StockPage from '../../components/stockPage';

export default function Stock() {
  const router = useRouter();
  const { symbol } = router.query;

  return <StockPage symbol={symbol} />;
}
