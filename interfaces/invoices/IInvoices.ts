export interface IAddInvoice {
title: string;
description: string;
price: string;
date: string;
type: 'paid' | 'due' | 'unpaid' | 'archived';
}

export interface IInvoice {
    id: number;
    title: string;
    description: string;
    price: string;
    date: string;
    type: 'paid' | 'due' | 'unpaid' | 'archived';
}