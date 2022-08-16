export interface IAddInvoice {
title: string;
description: string;
price: string;
date: string;
type: 'paid' | 'due' | 'unpaid' | 'archived';
}

export interface IInvoice {
    id: number | string;
    title: string;
    description: string;
    price: string;
    date: string;
    type: 'paid' | 'due' | 'unpaid' | 'archived';
}