
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Product, CartItem, ProductDocument } from '@/lib/types';
import { isEqual } from 'lodash';


interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductDocument, selectedVariants?: Record<string, string>) => void;
  addMultipleToCart: (items: CartItem[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemId: (product: ProductDocument, selectedVariants?: Record<string, string>) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const getCartItemId = useCallback((product: ProductDocument, selectedVariants?: Record<string, string>): string => {
    if (!selectedVariants || Object.keys(selectedVariants).length === 0) {
      return product.id;
    }
    const variantString = Object.keys(selectedVariants).sort().map(key => `${key}:${selectedVariants[key]}`).join('-');
    return `${product.id}-${variantString}`;
  }, []);


  const addToCart = (product: ProductDocument, selectedVariants?: Record<string, string>) => {
    setCart((prevCart) => {
      const cartItemId = getCartItemId(product, selectedVariants);
      const existingItem = prevCart.find((item) => getCartItemId(item.product, item.selectedVariants) === cartItemId);

      if (existingItem) {
        return prevCart.map((item) =>
          getCartItemId(item.product, item.selectedVariants) === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1, selectedVariants }];
    });
  };
  
  const addMultipleToCart = (items: CartItem[]) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      items.forEach(itemToAdd => {
        const cartItemId = getCartItemId(itemToAdd.product, itemToAdd.selectedVariants);
        const existingItemIndex = newCart.findIndex(
          item => getCartItemId(item.product, item.selectedVariants) === cartItemId
        );
        if (existingItemIndex > -1) {
          newCart[existingItemIndex].quantity += itemToAdd.quantity;
        } else {
          newCart.push(itemToAdd);
        }
      });
      return newCart;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => getCartItemId(item.product, item.selectedVariants) !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          getCartItemId(item.product, item.selectedVariants) === cartItemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, addMultipleToCart, removeFromCart, updateQuantity, clearCart, getCartItemId }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
