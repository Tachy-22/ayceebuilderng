// Google Analytics specific event tracking utility
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Track specific events with Google Analytics gtag
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters,
    });
  }
};

// Specific tracking functions for your ecommerce site
export const analytics = {
  // Product interactions
  trackProductView: (productId: string, productName: string, category: string, price: number) => {
    trackEvent({
      action: 'product_view_click',
      category: 'Product Interaction',
      label: productName,
      value: price,
      custom_parameters: {
        item_id: productId,
        item_name: productName,
        item_category: category,
        currency: 'NGN',
      },
    });
  },

  trackAddToCart: (productId: string, productName: string, category: string, price: number, quantity: number = 1) => {
    trackEvent({
      action: 'add_to_cart_button_click',
      category: 'Ecommerce',
      label: productName,
      value: price * quantity,
      custom_parameters: {
        item_id: productId,
        item_name: productName,
        item_category: category,
        quantity,
        currency: 'NGN',
        value: price * quantity,
      },
    });
  },

  trackRemoveFromCart: (productId: string, productName: string, category: string, price: number, quantity: number = 1) => {
    trackEvent({
      action: 'remove_from_cart_button_click',
      category: 'Ecommerce',
      label: productName,
      value: price * quantity,
      custom_parameters: {
        item_id: productId,
        item_name: productName,
        item_category: category,
        quantity,
        currency: 'NGN',
      },
    });
  },

  trackAddToWishlist: (productId: string, productName: string, category: string) => {
    trackEvent({
      action: 'wishlist_add_button_click',
      category: 'Product Interaction',
      label: productName,
      custom_parameters: {
        item_id: productId,
        item_name: productName,
        item_category: category,
      },
    });
  },

  trackRemoveFromWishlist: (productId: string, productName: string, category: string) => {
    trackEvent({
      action: 'wishlist_remove_button_click',
      category: 'Product Interaction',
      label: productName,
      custom_parameters: {
        item_id: productId,
        item_name: productName,
        item_category: category,
      },
    });
  },

  // Cart and checkout tracking
  trackBeginCheckout: (totalValue: number, itemCount: number, currency: string = 'NGN') => {
    trackEvent({
      action: 'begin_checkout_button_click',
      category: 'Ecommerce',
      value: totalValue,
      custom_parameters: {
        currency,
        value: totalValue,
        items_count: itemCount,
      },
    });
  },

  trackPurchaseCompleted: (transactionId: string, totalValue: number, items: any[], currency: string = 'NGN') => {
    trackEvent({
      action: 'purchase_completed',
      category: 'Ecommerce',
      value: totalValue,
      custom_parameters: {
        transaction_id: transactionId,
        currency,
        value: totalValue,
        items_count: items.length,
        items: items.map(item => ({
          item_id: item.productId,
          item_name: item.name,
          item_category: item.category,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
  },

  trackQuantityChange: (productId: string, productName: string, action: 'increase' | 'decrease', newQuantity: number) => {
    trackEvent({
      action: `quantity_${action}_button_click`,
      category: 'Cart Interaction',
      label: productName,
      custom_parameters: {
        item_id: productId,
        item_name: productName,
        new_quantity: newQuantity,
        change_type: action,
      },
    });
  },

  // Search tracking
  trackSearch: (searchTerm: string, searchType: 'product' | 'blog' = 'product', resultsCount?: number) => {
    trackEvent({
      action: `${searchType}_search_submit`,
      category: 'Search',
      label: searchTerm,
      custom_parameters: {
        search_term: searchTerm,
        search_type: searchType,
        results_count: resultsCount,
      },
    });
  },

  // Form tracking
  trackFormStart: (formName: string) => {
    trackEvent({
      action: `${formName}_form_start`,
      category: 'Form Interaction',
      label: formName,
      custom_parameters: {
        form_name: formName,
      },
    });
  },

  trackFormSubmit: (formName: string, success: boolean = true) => {
    trackEvent({
      action: success ? `${formName}_form_submit_success` : `${formName}_form_submit_error`,
      category: 'Form Interaction',
      label: formName,
      custom_parameters: {
        form_name: formName,
        success,
      },
    });
  },

  // Button clicks
  trackButtonClick: (buttonName: string, buttonLocation: string, additionalData?: Record<string, any>) => {
    trackEvent({
      action: `${buttonName}_button_click`,
      category: 'Button Interaction',
      label: `${buttonName} - ${buttonLocation}`,
      custom_parameters: {
        button_name: buttonName,
        button_location: buttonLocation,
        ...additionalData,
      },
    });
  },

  // Promo code tracking
  trackPromoCodeApply: (promoCode: string, success: boolean, discountAmount?: number) => {
    trackEvent({
      action: 'promo_code_apply_button_click',
      category: 'Ecommerce',
      label: promoCode,
      value: discountAmount,
      custom_parameters: {
        promo_code: promoCode,
        success,
        discount_amount: discountAmount,
      },
    });
  },

  // Navigation tracking
  trackNavigation: (linkName: string, linkLocation: string, destinationPage: string) => {
    trackEvent({
      action: `${linkLocation}_link_click`,
      category: 'Navigation',
      label: linkName,
      custom_parameters: {
        link_name: linkName,
        link_location: linkLocation,
        destination_page: destinationPage,
      },
    });
  },

  // Authentication tracking
  trackSignUp: (method: string = 'email') => {
    trackEvent({
      action: 'registration_form_submit_success',
      category: 'Authentication',
      label: method,
      custom_parameters: {
        method,
      },
    });
  },

  trackSignIn: (method: string = 'email') => {
    trackEvent({
      action: 'login_form_submit_success',
      category: 'Authentication',
      label: method,
      custom_parameters: {
        method,
      },
    });
  },

  trackSignOut: () => {
    trackEvent({
      action: 'logout_button_click',
      category: 'Authentication',
    });
  },
};

export default analytics;