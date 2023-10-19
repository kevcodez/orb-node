// File generated from our OpenAPI spec by Stainless.

import * as Core from 'orb-billing/core';
import { APIResource } from 'orb-billing/resource';
import { isRequestOptions } from 'orb-billing/core';
import * as InvoicesAPI from 'orb-billing/resources/invoices';
import * as PricesAPI from 'orb-billing/resources/prices/prices';
import { Page, type PageParams } from 'orb-billing/pagination';

export class Invoices extends APIResource {
  /**
   * This endpoint is used to create a one-off invoice for a customer.
   */
  create(body: InvoiceCreateParams, options?: Core.RequestOptions): Core.APIPromise<Invoice> {
    return this.post('/invoices', { body, ...options });
  }

  /**
   * This endpoint returns a list of all [`Invoice`](../guides/concepts#invoice)s for
   * an account in a list format.
   *
   * The list of invoices is ordered starting from the most recently issued invoice
   * date. The response also includes
   * [`pagination_metadata`](../reference/pagination), which lets the caller retrieve
   * the next page of results if they exist.
   *
   * By default, this only returns invoices that are `issued`, `paid`, or `synced`.
   */
  list(query?: InvoiceListParams, options?: Core.RequestOptions): Core.PagePromise<InvoicesPage, Invoice>;
  list(options?: Core.RequestOptions): Core.PagePromise<InvoicesPage, Invoice>;
  list(
    query: InvoiceListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.PagePromise<InvoicesPage, Invoice> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this.getAPIList('/invoices', InvoicesPage, { query, ...options });
  }

  /**
   * This endpoint is used to fetch an [`Invoice`](../guides/concepts#invoice) given
   * an identifier.
   */
  fetch(invoiceId: string, options?: Core.RequestOptions): Core.APIPromise<Invoice> {
    return this.get(`/invoices/${invoiceId}`, options);
  }

  /**
   * This endpoint can be used to fetch the upcoming
   * [invoice](../guides/concepts#invoice) for the current billing period given a
   * subscription.
   */
  fetchUpcoming(
    query?: InvoiceFetchUpcomingParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<InvoiceFetchUpcomingResponse>;
  fetchUpcoming(options?: Core.RequestOptions): Core.APIPromise<InvoiceFetchUpcomingResponse>;
  fetchUpcoming(
    query: InvoiceFetchUpcomingParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.APIPromise<InvoiceFetchUpcomingResponse> {
    if (isRequestOptions(query)) {
      return this.fetchUpcoming({}, query);
    }
    return this.get('/invoices/upcoming', { query, ...options });
  }

  /**
   * This endpoint allows an eligible invoice to be issued manually. This is only
   * possible with invoices where status is `draft`, `will_auto_issue` is true, and
   * an `eligible_to_issue_at` is a time in the past. Issuing an invoice could
   * possibly trigger side effects, some of which could be customer-visible (e.g.
   * sending emails, auto-collecting payment, syncing the invoice to external
   * providers, etc).
   */
  issue(invoiceId: string, options?: Core.RequestOptions): Core.APIPromise<Invoice> {
    return this.post(`/invoices/${invoiceId}/issue`, options);
  }

  /**
   * This endpoint allows an invoice's status to be set the `paid` status. This can
   * only be done to invoices that are in the `issued` status.
   */
  markPaid(
    invoiceId: string,
    body: InvoiceMarkPaidParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<Invoice> {
    return this.post(`/invoices/${invoiceId}/mark_paid`, { body, ...options });
  }

  /**
   * This endpoint allows an invoice's status to be set the `void` status. This can
   * only be done to invoices that are in the `issued` status.
   *
   * If the associated invoice has used the customer balance to change the amount
   * due, the customer balance operation will be reverted. For example, if the
   * invoice used $10 of customer balance, that amount will be added back to the
   * customer balance upon voiding.
   */
  void(invoiceId: string, options?: Core.RequestOptions): Core.APIPromise<Invoice> {
    return this.post(`/invoices/${invoiceId}/void`, options);
  }
}

export class InvoicesPage extends Page<Invoice> {}

/**
 * An [`Invoice`](../guides/concepts#invoice) is a fundamental billing entity,
 * representing the request for payment for a single subscription. This includes a
 * set of line items, which correspond to prices in the subscription's plan and can
 * represent fixed recurring fees or usage-based fees. They are generated at the
 * end of a billing period, or as the result of an action, such as a cancellation.
 */
export interface Invoice {
  id: string;

  /**
   * This is the final amount required to be charged to the customer and reflects the
   * application of the customer balance to the `total` of the invoice.
   */
  amount_due: string;

  auto_collection: Invoice.AutoCollection;

  billing_address: Invoice.BillingAddress | null;

  /**
   * The creation time of the resource in Orb.
   */
  created_at: string;

  /**
   * A list of credit notes associated with the invoice
   */
  credit_notes: Array<Invoice.CreditNote>;

  /**
   * An ISO 4217 currency string or `credits`
   */
  currency: string;

  customer: Invoice.Customer;

  customer_balance_transactions: Array<Invoice.CustomerBalanceTransaction>;

  customer_tax_id: Invoice.CustomerTaxID | null;

  discount: InvoiceDiscount | null;

  discounts: Array<InvoiceDiscount>;

  /**
   * When the invoice payment is due.
   */
  due_date: string;

  /**
   * If the invoice has a status of `draft`, this will be the time that the invoice
   * will be eligible to be issued, otherwise it will be `null`. If `auto-issue` is
   * true, the invoice will automatically begin issuing at this time.
   */
  eligible_to_issue_at: string | null;

  /**
   * A URL for the invoice portal.
   */
  hosted_invoice_url: string | null;

  /**
   * The scheduled date of the invoice
   */
  invoice_date: string;

  /**
   * Automatically generated invoice number to help track and reconcile invoices.
   * Invoice numbers have a prefix such as `RFOBWG`. These can be sequential per
   * account or customer.
   */
  invoice_number: string;

  /**
   * The link to download the PDF representation of the `Invoice`.
   */
  invoice_pdf: string | null;

  /**
   * If the invoice failed to issue, this will be the last time it failed to issue
   * (even if it is now in a different state.)
   */
  issue_failed_at: string | null;

  /**
   * If the invoice has been issued, this will be the time it transitioned to
   * `issued` (even if it is now in a different state.)
   */
  issued_at: string | null;

  /**
   * The breakdown of prices in this invoice.
   */
  line_items: Array<Invoice.LineItem>;

  maximum: Invoice.Maximum | null;

  maximum_amount: string | null;

  /**
   * Free-form text which is available on the invoice PDF and the Orb invoice portal.
   */
  memo: string | null;

  metadata: unknown;

  minimum: Invoice.Minimum | null;

  minimum_amount: string | null;

  /**
   * If the invoice has a status of `paid`, this gives a timestamp when the invoice
   * was paid.
   */
  paid_at: string | null;

  /**
   * If payment was attempted on this invoice but failed, this will be the time of
   * the most recent attempt.
   */
  payment_failed_at: string | null;

  /**
   * If payment was attempted on this invoice, this will be the start time of the
   * most recent attempt. This field is especially useful for delayed-notification
   * payment mechanisms (like bank transfers), where payment can take 3 days or more.
   */
  payment_started_at: string | null;

  /**
   * If the invoice is in draft, this timestamp will reflect when the invoice is
   * scheduled to be issued.
   */
  scheduled_issue_at: string | null;

  shipping_address: Invoice.ShippingAddress | null;

  status: 'issued' | 'paid' | 'synced' | 'void' | 'draft';

  subscription: Invoice.Subscription | null;

  /**
   * The total before any discounts and minimums are applied.
   */
  subtotal: string;

  /**
   * If the invoice failed to sync, this will be the last time an external invoicing
   * provider sync was attempted. This field will always be `null` for invoices using
   * Orb Invoicing.
   */
  sync_failed_at: string | null;

  /**
   * The total after any minimums and discounts have been applied.
   */
  total: string;

  /**
   * If the invoice has a status of `void`, this gives a timestamp when the invoice
   * was voided.
   */
  voided_at: string | null;

  /**
   * This is true if the invoice will be automatically issued in the future, and
   * false otherwise.
   */
  will_auto_issue: boolean;
}

export namespace Invoice {
  export interface AutoCollection {
    /**
     * True only if auto-collection is enabled for this invoice.
     */
    enabled: boolean | null;

    /**
     * If the invoice is scheduled for auto-collection, this field will reflect when
     * the next attempt will occur. If dunning has been exhausted, or auto-collection
     * is not enabled for this invoice, this field will be `null`.
     */
    next_attempt_at: string | null;

    /**
     * If Orb has ever attempted payment auto-collection for this invoice, this field
     * will reflect when that attempt occurred. In conjunction with `next_attempt_at`,
     * this can be used to tell whether the invoice is currently in dunning (that is,
     * `previously_attempted_at` is non-null, and `next_attempt_time` is non-null), or
     * if dunning has been exhausted (`previously_attempted_at` is non-null, but
     * `next_attempt_time` is null).
     */
    previously_attempted_at: string | null;
  }

  export interface BillingAddress {
    city: string | null;

    country: string | null;

    line1: string | null;

    line2: string | null;

    postal_code: string | null;

    state: string | null;
  }

  export interface CreditNote {
    id: string;

    credit_note_number: string;

    reason: string;

    total: string;

    type: string;

    /**
     * If the credit note has a status of `void`, this gives a timestamp when the
     * credit note was voided.
     */
    voided_at: string | null;
  }

  export interface Customer {
    id: string;

    external_customer_id: string | null;
  }

  export interface CustomerBalanceTransaction {
    /**
     * A unique id for this transaction.
     */
    id: string;

    action: 'applied_to_invoice' | 'prorated_refund' | 'manual_adjustment';

    /**
     * The value of the amount changed in the transaction.
     */
    amount: string;

    /**
     * The creation time of this transaction.
     */
    created_at: string;

    credit_note: CustomerBalanceTransaction.CreditNote | null;

    /**
     * An optional description provided for manual customer balance adjustments.
     */
    description: string | null;

    /**
     * The new value of the customer's balance prior to the transaction, in the
     * customer's currency.
     */
    ending_balance: string;

    invoice: CustomerBalanceTransaction.Invoice | null;

    /**
     * The original value of the customer's balance prior to the transaction, in the
     * customer's currency.
     */
    starting_balance: string;

    type: 'increment' | 'decrement';
  }

  export namespace CustomerBalanceTransaction {
    export interface CreditNote {
      /**
       * The id of the Credit note
       */
      id: string;
    }

    export interface Invoice {
      /**
       * The Invoice id
       */
      id: string;
    }
  }

  export interface CustomerTaxID {
    country: string;

    type: string;

    value: string;
  }

  export interface LineItem {
    /**
     * A unique ID for this line item.
     */
    id: string;

    /**
     * The final amount after any discounts or minimums.
     */
    amount: string;

    discount: InvoicesAPI.InvoiceDiscount | null;

    /**
     * The end date of the range of time applied for this line item's price.
     */
    end_date: string;

    /**
     * [DEPRECATED] For configured prices that are split by a grouping key, this will
     * be populated with the key and a value. The `amount` and `subtotal` will be the
     * values for this particular grouping.
     */
    grouping: string | null;

    maximum: LineItem.Maximum | null;

    maximum_amount: string | null;

    minimum: LineItem.Minimum | null;

    minimum_amount: string | null;

    /**
     * The name of the price associated with this line item.
     */
    name: string;

    /**
     * The Price resource represents a price that can be billed on a subscription,
     * resulting in a charge on an invoice in the form of an invoice line item. Prices
     * take a quantity and determine an amount to bill.
     *
     * Orb supports a few different pricing models out of the box. Each of these models
     * is serialized differently in a given Price object. The model_type field
     * determines the key for the configuration object that is present.
     *
     * ## Unit pricing
     *
     * With unit pricing, each unit costs a fixed amount.
     *
     * ```json
     * {
     *     ...
     *     "model_type": "unit",
     *     "unit_config": {
     *         "unit_amount": "0.50"
     *     }
     *     ...
     * }
     * ```
     *
     * ## Tiered pricing
     *
     * In tiered pricing, the cost of a given unit depends on the tier range that it
     * falls into, where each tier range is defined by an upper and lower bound. For
     * example, the first ten units may cost $0.50 each and all units thereafter may
     * cost $0.10 each.
     *
     * ```json
     * {
     *     ...
     *     "model_type": "tiered",
     *     "tiered_config": {
     *         "tiers": [
     *             {
     *                 "first_unit": 1,
     *                 "last_unit": 10,
     *                 "unit_amount": "0.50"
     *             },
     *             {
     *                 "first_unit": 11,
     *                 "last_unit": null,
     *                 "unit_amount": "0.10"
     *             }
     *         ]
     *     }
     *     ...
     * ```
     *
     * ## Bulk pricing
     *
     * Bulk pricing applies when the number of units determine the cost of all units.
     * For example, if you've bought less than 10 units, they may each be $0.50 for a
     * total of $5.00. Once you've bought more than 10 units, all units may now be
     * priced at $0.40 (i.e. 101 units total would be $40.40).
     *
     * ```json
     * {
     *     ...
     *     "model_type": "bulk",
     *     "bulk_config": {
     *         "tiers": [
     *             {
     *                 "maximum_units": 10,
     *                 "unit_amount": "0.50"
     *             },
     *             {
     *                 "maximum_units": 1000,
     *                 "unit_amount": "0.40"
     *             }
     *         ]
     *     }
     *     ...
     * }
     * ```
     *
     * ## Package pricing
     *
     * Package pricing defines the size or granularity of a unit for billing purposes.
     * For example, if the package size is set to 5, then 4 units will be billed as 5
     * and 6 units will be billed at 10.
     *
     * ```json
     * {
     *     ...
     *     "model_type": "package",
     *     "package_config": {
     *         "package_amount": "0.80",
     *         "package_size": 10
     *     }
     *     ...
     * }
     * ```
     *
     * ## BPS pricing
     *
     * BPS pricing specifies a per-event (e.g. per-payment) rate in one hundredth of a
     * percent (the number of basis points to charge), as well as a cap per event to
     * assess. For example, this would allow you to assess a fee of 0.25% on every
     * payment you process, with a maximum charge of $25 per payment.
     *
     * ```json
     * {
     *     ...
     *     "model_type": "bps",
     *     "bps_config": {
     *        "bps": 125,
     *        "per_unit_maximum": "11.00"
     *     }
     *     ...
     *  }
     * ```
     *
     * ## Bulk BPS pricing
     *
     * Bulk BPS pricing specifies BPS parameters in a tiered manner, dependent on the
     * total quantity across all events. Similar to bulk pricing, the BPS parameters of
     * a given event depends on the tier range that the billing period falls into. Each
     * tier range is defined by an upper bound. For example, after $1.5M of payment
     * volume is reached, each individual payment may have a lower cap or a smaller
     * take-rate.
     *
     * ```json
     *     ...
     *     "model_type": "bulk_bps",
     *     "bulk_bps_config": {
     *         "tiers": [
     *            {
     *                 "maximum_amount": "1000000.00",
     *                 "bps": 125,
     *                 "per_unit_maximum": "19.00"
     *            },
     *           {
     *                 "maximum_amount": null,
     *                 "bps": 115,
     *                 "per_unit_maximum": "4.00"
     *             }
     *         ]
     *     }
     *     ...
     * }
     * ```
     *
     * ## Tiered BPS pricing
     *
     * Tiered BPS pricing specifies BPS parameters in a graduated manner, where an
     * event's applicable parameter is a function of its marginal addition to the
     * period total. Similar to tiered pricing, the BPS parameters of a given event
     * depends on the tier range that it falls into, where each tier range is defined
     * by an upper and lower bound. For example, the first few payments may have a 0.8
     * BPS take-rate and all payments after a specific volume may incur a take-rate of
     * 0.5 BPS each.
     *
     * ```json
     *     ...
     *     "model_type": "tiered_bps",
     *     "tiered_bps_config": {
     *         "tiers": [
     *            {
     *                 "minimum_amount": "0",
     *                 "maximum_amount": "1000000.00",
     *                 "bps": 125,
     *                 "per_unit_maximum": "19.00"
     *            },
     *           {
     *                 "minimum_amount": "1000000.00",
     *                 "maximum_amount": null,
     *                 "bps": 115,
     *                 "per_unit_maximum": "4.00"
     *             }
     *         ]
     *     }
     *     ...
     * }
     * ```
     *
     * ## Matrix pricing
     *
     * Matrix pricing defines a set of unit prices in a one or two-dimensional matrix.
     * `dimensions` defines the two event property values evaluated in this pricing
     * model. In a one-dimensional matrix, the second value is `null`. Every
     * configuration has a list of `matrix_values` which give the unit prices for
     * specified property values. In a one-dimensional matrix, the matrix values will
     * have `dimension_values` where the second value of the pair is null. If an event
     * does not match any of the dimension values in the matrix, it will resort to the
     * `default_unit_amount`.
     *
     * ```json
     * {
     *     "model_type": "matrix"
     *     "matrix_config": {
     *         "default_unit_amount": "3.00",
     *         "dimensions": [
     *             "cluster_name",
     *             "region"
     *         ],
     *         "matrix_values": [
     *             {
     *                 "dimension_values": [
     *                     "alpha",
     *                     "west"
     *                 ],
     *                 "unit_amount": "2.00"
     *             },
     *             ...
     *         ]
     *     }
     * }
     * ```
     *
     * ### Fixed fees
     *
     * Fixed fees are prices that are applied independent of usage quantities, and
     * follow unit pricing. They also have an additional parameter
     * `fixed_price_quantity`. If the Price represents a fixed cost, this represents
     * the quantity of units applied.
     *
     * ```json
     * {
     *     ...
     *     "id": "price_id",
     *     "model_type": "unit",
     *     "unit_config": {
     *        "unit_amount": "2.00"
     *     },
     *     "fixed_price_quantity": 3.0
     *     ...
     * }
     * ```
     */
    price: PricesAPI.Price | null;

    quantity: number;

    /**
     * The start date of the range of time applied for this line item's price.
     */
    start_date: string;

    /**
     * For complex pricing structures, the line item can be broken down further in
     * `sub_line_items`.
     */
    sub_line_items: Array<LineItem.MatrixSubLineItem | LineItem.TierSubLineItem | LineItem.OtherSubLineItem>;

    /**
     * The line amount before any line item-specific discounts or minimums.
     */
    subtotal: string;

    /**
     * An array of tax rates and their incurred tax amounts. Empty if no tax
     * integration is configured.
     */
    tax_amounts: Array<LineItem.TaxAmount>;
  }

  export namespace LineItem {
    export interface Maximum {
      /**
       * List of price_ids that this maximum amount applies to. For plan/plan phase
       * maximums, this can be a subset of prices.
       */
      applies_to_price_ids: Array<string>;

      /**
       * Maximum amount applied
       */
      maximum_amount: string;
    }

    export interface Minimum {
      /**
       * List of price_ids that this minimum amount applies to. For plan/plan phase
       * minimums, this can be a subset of prices.
       */
      applies_to_price_ids: Array<string>;

      /**
       * Minimum amount applied
       */
      minimum_amount: string;
    }

    export interface MatrixSubLineItem {
      /**
       * The total amount for this sub line item.
       */
      amount: string;

      grouping: MatrixSubLineItem.Grouping | null;

      matrix_config: MatrixSubLineItem.MatrixConfig;

      name: string;

      quantity: number;

      type: 'matrix';
    }

    export namespace MatrixSubLineItem {
      export interface Grouping {
        key: string;

        /**
         * No value indicates the default group
         */
        value: string | null;
      }

      export interface MatrixConfig {
        /**
         * The ordered dimension values for this line item.
         */
        dimension_values: Array<string | null>;
      }
    }

    export interface TierSubLineItem {
      /**
       * The total amount for this sub line item.
       */
      amount: string;

      grouping: TierSubLineItem.Grouping | null;

      name: string;

      quantity: number;

      tier_config: TierSubLineItem.TierConfig;

      type: 'tier';
    }

    export namespace TierSubLineItem {
      export interface Grouping {
        key: string;

        /**
         * No value indicates the default group
         */
        value: string | null;
      }

      export interface TierConfig {
        first_unit: number;

        last_unit: number | null;

        unit_amount: string;
      }
    }

    export interface OtherSubLineItem {
      /**
       * The total amount for this sub line item.
       */
      amount: string;

      grouping: OtherSubLineItem.Grouping | null;

      name: string;

      quantity: number;

      type: "'null'";
    }

    export namespace OtherSubLineItem {
      export interface Grouping {
        key: string;

        /**
         * No value indicates the default group
         */
        value: string | null;
      }
    }

    export interface TaxAmount {
      /**
       * The amount of additional tax incurred by this tax rate.
       */
      amount: string;

      /**
       * The human-readable description of the applied tax rate.
       */
      tax_rate_description: string;

      /**
       * The tax rate percentage, out of 100.
       */
      tax_rate_percentage: string | null;
    }
  }

  export interface Maximum {
    /**
     * List of price_ids that this maximum amount applies to. For plan/plan phase
     * maximums, this can be a subset of prices.
     */
    applies_to_price_ids: Array<string>;

    /**
     * Maximum amount applied
     */
    maximum_amount: string;
  }

  export interface Minimum {
    /**
     * List of price_ids that this minimum amount applies to. For plan/plan phase
     * minimums, this can be a subset of prices.
     */
    applies_to_price_ids: Array<string>;

    /**
     * Minimum amount applied
     */
    minimum_amount: string;
  }

  export interface ShippingAddress {
    city: string | null;

    country: string | null;

    line1: string | null;

    line2: string | null;

    postal_code: string | null;

    state: string | null;
  }

  export interface Subscription {
    id: string;
  }
}

export type InvoiceDiscount =
  | InvoiceDiscount.PercentageDiscount
  | InvoiceDiscount.TrialDiscount
  | InvoiceDiscount.UsageDiscount
  | InvoiceDiscount.AmountDiscount;

export namespace InvoiceDiscount {
  export interface PercentageDiscount {
    /**
     * List of price_ids that this discount applies to. For plan/plan phase discounts,
     * this can be a subset of prices.
     */
    applies_to_price_ids: Array<string>;

    discount_type: 'percentage';

    /**
     * Only available if discount_type is `percentage`.This is a number between 0
     * and 1.
     */
    percentage_discount: number;
  }

  export interface TrialDiscount {
    /**
     * List of price_ids that this discount applies to. For plan/plan phase discounts,
     * this can be a subset of prices.
     */
    applies_to_price_ids: Array<string>;

    discount_type: 'trial';

    /**
     * Only available if discount_type is `trial`
     */
    trial_amount_discount?: string | null;

    /**
     * Only available if discount_type is `trial`
     */
    trial_percentage_discount?: number | null;
  }

  export interface UsageDiscount {
    /**
     * List of price_ids that this discount applies to. For plan/plan phase discounts,
     * this can be a subset of prices.
     */
    applies_to_price_ids: Array<string>;

    discount_type: 'usage';

    /**
     * Only available if discount_type is `usage`. Number of usage units that this
     * discount is for
     */
    usage_discount: number;
  }

  export interface AmountDiscount {
    /**
     * Only available if discount_type is `amount`.
     */
    amount_discount: string;

    /**
     * List of price_ids that this discount applies to. For plan/plan phase discounts,
     * this can be a subset of prices.
     */
    applies_to_price_ids: Array<string>;

    discount_type: 'amount';
  }
}

export interface InvoiceFetchUpcomingResponse {
  id: string;

  /**
   * This is the final amount required to be charged to the customer and reflects the
   * application of the customer balance to the `total` of the invoice.
   */
  amount_due: string;

  auto_collection: InvoiceFetchUpcomingResponse.AutoCollection;

  billing_address: InvoiceFetchUpcomingResponse.BillingAddress | null;

  /**
   * The creation time of the resource in Orb.
   */
  created_at: string;

  /**
   * A list of credit notes associated with the invoice
   */
  credit_notes: Array<InvoiceFetchUpcomingResponse.CreditNote>;

  /**
   * An ISO 4217 currency string or `credits`
   */
  currency: string;

  customer: InvoiceFetchUpcomingResponse.Customer;

  customer_balance_transactions: Array<InvoiceFetchUpcomingResponse.CustomerBalanceTransaction>;

  customer_tax_id: InvoiceFetchUpcomingResponse.CustomerTaxID | null;

  discount: InvoiceDiscount | null;

  discounts: Array<InvoiceDiscount>;

  /**
   * When the invoice payment is due.
   */
  due_date: string;

  /**
   * If the invoice has a status of `draft`, this will be the time that the invoice
   * will be eligible to be issued, otherwise it will be `null`. If `auto-issue` is
   * true, the invoice will automatically begin issuing at this time.
   */
  eligible_to_issue_at: string | null;

  /**
   * A URL for the invoice portal.
   */
  hosted_invoice_url: string | null;

  /**
   * Automatically generated invoice number to help track and reconcile invoices.
   * Invoice numbers have a prefix such as `RFOBWG`. These can be sequential per
   * account or customer.
   */
  invoice_number: string;

  /**
   * The link to download the PDF representation of the `Invoice`.
   */
  invoice_pdf: string | null;

  /**
   * If the invoice failed to issue, this will be the last time it failed to issue
   * (even if it is now in a different state.)
   */
  issue_failed_at: string | null;

  /**
   * If the invoice has been issued, this will be the time it transitioned to
   * `issued` (even if it is now in a different state.)
   */
  issued_at: string | null;

  /**
   * The breakdown of prices in this invoice.
   */
  line_items: Array<InvoiceFetchUpcomingResponse.LineItem>;

  maximum: InvoiceFetchUpcomingResponse.Maximum | null;

  maximum_amount: string | null;

  /**
   * Free-form text which is available on the invoice PDF and the Orb invoice portal.
   */
  memo: string | null;

  metadata: unknown;

  minimum: InvoiceFetchUpcomingResponse.Minimum | null;

  minimum_amount: string | null;

  /**
   * If the invoice has a status of `paid`, this gives a timestamp when the invoice
   * was paid.
   */
  paid_at: string | null;

  /**
   * If payment was attempted on this invoice but failed, this will be the time of
   * the most recent attempt.
   */
  payment_failed_at: string | null;

  /**
   * If payment was attempted on this invoice, this will be the start time of the
   * most recent attempt. This field is especially useful for delayed-notification
   * payment mechanisms (like bank transfers), where payment can take 3 days or more.
   */
  payment_started_at: string | null;

  /**
   * If the invoice is in draft, this timestamp will reflect when the invoice is
   * scheduled to be issued.
   */
  scheduled_issue_at: string | null;

  shipping_address: InvoiceFetchUpcomingResponse.ShippingAddress | null;

  status: 'issued' | 'paid' | 'synced' | 'void' | 'draft';

  subscription: InvoiceFetchUpcomingResponse.Subscription | null;

  /**
   * The total before any discounts and minimums are applied.
   */
  subtotal: string;

  /**
   * If the invoice failed to sync, this will be the last time an external invoicing
   * provider sync was attempted. This field will always be `null` for invoices using
   * Orb Invoicing.
   */
  sync_failed_at: string | null;

  /**
   * The scheduled date of the invoice
   */
  target_date: string;

  /**
   * The total after any minimums and discounts have been applied.
   */
  total: string;

  /**
   * If the invoice has a status of `void`, this gives a timestamp when the invoice
   * was voided.
   */
  voided_at: string | null;

  /**
   * This is true if the invoice will be automatically issued in the future, and
   * false otherwise.
   */
  will_auto_issue: boolean;
}

export namespace InvoiceFetchUpcomingResponse {
  export interface AutoCollection {
    /**
     * True only if auto-collection is enabled for this invoice.
     */
    enabled: boolean | null;

    /**
     * If the invoice is scheduled for auto-collection, this field will reflect when
     * the next attempt will occur. If dunning has been exhausted, or auto-collection
     * is not enabled for this invoice, this field will be `null`.
     */
    next_attempt_at: string | null;

    /**
     * If Orb has ever attempted payment auto-collection for this invoice, this field
     * will reflect when that attempt occurred. In conjunction with `next_attempt_at`,
     * this can be used to tell whether the invoice is currently in dunning (that is,
     * `previously_attempted_at` is non-null, and `next_attempt_time` is non-null), or
     * if dunning has been exhausted (`previously_attempted_at` is non-null, but
     * `next_attempt_time` is null).
     */
    previously_attempted_at: string | null;
  }

  export interface BillingAddress {
    city: string | null;

    country: string | null;

    line1: string | null;

    line2: string | null;

    postal_code: string | null;

    state: string | null;
  }

  export interface CreditNote {
    id: string;

    credit_note_number: string;

    reason: string;

    total: string;

    type: string;

    /**
     * If the credit note has a status of `void`, this gives a timestamp when the
     * credit note was voided.
     */
    voided_at: string | null;
  }

  export interface Customer {
    id: string;

    external_customer_id: string | null;
  }

  export interface CustomerBalanceTransaction {
    /**
     * A unique id for this transaction.
     */
    id: string;

    action: 'applied_to_invoice' | 'prorated_refund' | 'manual_adjustment';

    /**
     * The value of the amount changed in the transaction.
     */
    amount: string;

    /**
     * The creation time of this transaction.
     */
    created_at: string;

    credit_note: CustomerBalanceTransaction.CreditNote | null;

    /**
     * An optional description provided for manual customer balance adjustments.
     */
    description: string | null;

    /**
     * The new value of the customer's balance prior to the transaction, in the
     * customer's currency.
     */
    ending_balance: string;

    invoice: CustomerBalanceTransaction.Invoice | null;

    /**
     * The original value of the customer's balance prior to the transaction, in the
     * customer's currency.
     */
    starting_balance: string;

    type: 'increment' | 'decrement';
  }

  export namespace CustomerBalanceTransaction {
    export interface CreditNote {
      /**
       * The id of the Credit note
       */
      id: string;
    }

    export interface Invoice {
      /**
       * The Invoice id
       */
      id: string;
    }
  }

  export interface CustomerTaxID {
    country: string;

    type: string;

    value: string;
  }

  export interface LineItem {
    /**
     * A unique ID for this line item.
     */
    id: string;

    /**
     * The final amount after any discounts or minimums.
     */
    amount: string;

    discount: InvoicesAPI.InvoiceDiscount | null;

    /**
     * The end date of the range of time applied for this line item's price.
     */
    end_date: string;

    /**
     * [DEPRECATED] For configured prices that are split by a grouping key, this will
     * be populated with the key and a value. The `amount` and `subtotal` will be the
     * values for this particular grouping.
     */
    grouping: string | null;

    maximum: LineItem.Maximum | null;

    maximum_amount: string | null;

    minimum: LineItem.Minimum | null;

    minimum_amount: string | null;

    /**
     * The name of the price associated with this line item.
     */
    name: string;

    /**
     * The Price resource represents a price that can be billed on a subscription,
     * resulting in a charge on an invoice in the form of an invoice line item. Prices
     * take a quantity and determine an amount to bill.
     *
     * Orb supports a few different pricing models out of the box. Each of these models
     * is serialized differently in a given Price object. The model_type field
     * determines the key for the configuration object that is present.
     *
     * ## Unit pricing
     *
     * With unit pricing, each unit costs a fixed amount.
     *
     * ```json
     * {
     *     ...
     *     "model_type": "unit",
     *     "unit_config": {
     *         "unit_amount": "0.50"
     *     }
     *     ...
     * }
     * ```
     *
     * ## Tiered pricing
     *
     * In tiered pricing, the cost of a given unit depends on the tier range that it
     * falls into, where each tier range is defined by an upper and lower bound. For
     * example, the first ten units may cost $0.50 each and all units thereafter may
     * cost $0.10 each.
     *
     * ```json
     * {
     *     ...
     *     "model_type": "tiered",
     *     "tiered_config": {
     *         "tiers": [
     *             {
     *                 "first_unit": 1,
     *                 "last_unit": 10,
     *                 "unit_amount": "0.50"
     *             },
     *             {
     *                 "first_unit": 11,
     *                 "last_unit": null,
     *                 "unit_amount": "0.10"
     *             }
     *         ]
     *     }
     *     ...
     * ```
     *
     * ## Bulk pricing
     *
     * Bulk pricing applies when the number of units determine the cost of all units.
     * For example, if you've bought less than 10 units, they may each be $0.50 for a
     * total of $5.00. Once you've bought more than 10 units, all units may now be
     * priced at $0.40 (i.e. 101 units total would be $40.40).
     *
     * ```json
     * {
     *     ...
     *     "model_type": "bulk",
     *     "bulk_config": {
     *         "tiers": [
     *             {
     *                 "maximum_units": 10,
     *                 "unit_amount": "0.50"
     *             },
     *             {
     *                 "maximum_units": 1000,
     *                 "unit_amount": "0.40"
     *             }
     *         ]
     *     }
     *     ...
     * }
     * ```
     *
     * ## Package pricing
     *
     * Package pricing defines the size or granularity of a unit for billing purposes.
     * For example, if the package size is set to 5, then 4 units will be billed as 5
     * and 6 units will be billed at 10.
     *
     * ```json
     * {
     *     ...
     *     "model_type": "package",
     *     "package_config": {
     *         "package_amount": "0.80",
     *         "package_size": 10
     *     }
     *     ...
     * }
     * ```
     *
     * ## BPS pricing
     *
     * BPS pricing specifies a per-event (e.g. per-payment) rate in one hundredth of a
     * percent (the number of basis points to charge), as well as a cap per event to
     * assess. For example, this would allow you to assess a fee of 0.25% on every
     * payment you process, with a maximum charge of $25 per payment.
     *
     * ```json
     * {
     *     ...
     *     "model_type": "bps",
     *     "bps_config": {
     *        "bps": 125,
     *        "per_unit_maximum": "11.00"
     *     }
     *     ...
     *  }
     * ```
     *
     * ## Bulk BPS pricing
     *
     * Bulk BPS pricing specifies BPS parameters in a tiered manner, dependent on the
     * total quantity across all events. Similar to bulk pricing, the BPS parameters of
     * a given event depends on the tier range that the billing period falls into. Each
     * tier range is defined by an upper bound. For example, after $1.5M of payment
     * volume is reached, each individual payment may have a lower cap or a smaller
     * take-rate.
     *
     * ```json
     *     ...
     *     "model_type": "bulk_bps",
     *     "bulk_bps_config": {
     *         "tiers": [
     *            {
     *                 "maximum_amount": "1000000.00",
     *                 "bps": 125,
     *                 "per_unit_maximum": "19.00"
     *            },
     *           {
     *                 "maximum_amount": null,
     *                 "bps": 115,
     *                 "per_unit_maximum": "4.00"
     *             }
     *         ]
     *     }
     *     ...
     * }
     * ```
     *
     * ## Tiered BPS pricing
     *
     * Tiered BPS pricing specifies BPS parameters in a graduated manner, where an
     * event's applicable parameter is a function of its marginal addition to the
     * period total. Similar to tiered pricing, the BPS parameters of a given event
     * depends on the tier range that it falls into, where each tier range is defined
     * by an upper and lower bound. For example, the first few payments may have a 0.8
     * BPS take-rate and all payments after a specific volume may incur a take-rate of
     * 0.5 BPS each.
     *
     * ```json
     *     ...
     *     "model_type": "tiered_bps",
     *     "tiered_bps_config": {
     *         "tiers": [
     *            {
     *                 "minimum_amount": "0",
     *                 "maximum_amount": "1000000.00",
     *                 "bps": 125,
     *                 "per_unit_maximum": "19.00"
     *            },
     *           {
     *                 "minimum_amount": "1000000.00",
     *                 "maximum_amount": null,
     *                 "bps": 115,
     *                 "per_unit_maximum": "4.00"
     *             }
     *         ]
     *     }
     *     ...
     * }
     * ```
     *
     * ## Matrix pricing
     *
     * Matrix pricing defines a set of unit prices in a one or two-dimensional matrix.
     * `dimensions` defines the two event property values evaluated in this pricing
     * model. In a one-dimensional matrix, the second value is `null`. Every
     * configuration has a list of `matrix_values` which give the unit prices for
     * specified property values. In a one-dimensional matrix, the matrix values will
     * have `dimension_values` where the second value of the pair is null. If an event
     * does not match any of the dimension values in the matrix, it will resort to the
     * `default_unit_amount`.
     *
     * ```json
     * {
     *     "model_type": "matrix"
     *     "matrix_config": {
     *         "default_unit_amount": "3.00",
     *         "dimensions": [
     *             "cluster_name",
     *             "region"
     *         ],
     *         "matrix_values": [
     *             {
     *                 "dimension_values": [
     *                     "alpha",
     *                     "west"
     *                 ],
     *                 "unit_amount": "2.00"
     *             },
     *             ...
     *         ]
     *     }
     * }
     * ```
     *
     * ### Fixed fees
     *
     * Fixed fees are prices that are applied independent of usage quantities, and
     * follow unit pricing. They also have an additional parameter
     * `fixed_price_quantity`. If the Price represents a fixed cost, this represents
     * the quantity of units applied.
     *
     * ```json
     * {
     *     ...
     *     "id": "price_id",
     *     "model_type": "unit",
     *     "unit_config": {
     *        "unit_amount": "2.00"
     *     },
     *     "fixed_price_quantity": 3.0
     *     ...
     * }
     * ```
     */
    price: PricesAPI.Price | null;

    quantity: number;

    /**
     * The start date of the range of time applied for this line item's price.
     */
    start_date: string;

    /**
     * For complex pricing structures, the line item can be broken down further in
     * `sub_line_items`.
     */
    sub_line_items: Array<LineItem.MatrixSubLineItem | LineItem.TierSubLineItem | LineItem.OtherSubLineItem>;

    /**
     * The line amount before any line item-specific discounts or minimums.
     */
    subtotal: string;

    /**
     * An array of tax rates and their incurred tax amounts. Empty if no tax
     * integration is configured.
     */
    tax_amounts: Array<LineItem.TaxAmount>;
  }

  export namespace LineItem {
    export interface Maximum {
      /**
       * List of price_ids that this maximum amount applies to. For plan/plan phase
       * maximums, this can be a subset of prices.
       */
      applies_to_price_ids: Array<string>;

      /**
       * Maximum amount applied
       */
      maximum_amount: string;
    }

    export interface Minimum {
      /**
       * List of price_ids that this minimum amount applies to. For plan/plan phase
       * minimums, this can be a subset of prices.
       */
      applies_to_price_ids: Array<string>;

      /**
       * Minimum amount applied
       */
      minimum_amount: string;
    }

    export interface MatrixSubLineItem {
      /**
       * The total amount for this sub line item.
       */
      amount: string;

      grouping: MatrixSubLineItem.Grouping | null;

      matrix_config: MatrixSubLineItem.MatrixConfig;

      name: string;

      quantity: number;

      type: 'matrix';
    }

    export namespace MatrixSubLineItem {
      export interface Grouping {
        key: string;

        /**
         * No value indicates the default group
         */
        value: string | null;
      }

      export interface MatrixConfig {
        /**
         * The ordered dimension values for this line item.
         */
        dimension_values: Array<string | null>;
      }
    }

    export interface TierSubLineItem {
      /**
       * The total amount for this sub line item.
       */
      amount: string;

      grouping: TierSubLineItem.Grouping | null;

      name: string;

      quantity: number;

      tier_config: TierSubLineItem.TierConfig;

      type: 'tier';
    }

    export namespace TierSubLineItem {
      export interface Grouping {
        key: string;

        /**
         * No value indicates the default group
         */
        value: string | null;
      }

      export interface TierConfig {
        first_unit: number;

        last_unit: number | null;

        unit_amount: string;
      }
    }

    export interface OtherSubLineItem {
      /**
       * The total amount for this sub line item.
       */
      amount: string;

      grouping: OtherSubLineItem.Grouping | null;

      name: string;

      quantity: number;

      type: "'null'";
    }

    export namespace OtherSubLineItem {
      export interface Grouping {
        key: string;

        /**
         * No value indicates the default group
         */
        value: string | null;
      }
    }

    export interface TaxAmount {
      /**
       * The amount of additional tax incurred by this tax rate.
       */
      amount: string;

      /**
       * The human-readable description of the applied tax rate.
       */
      tax_rate_description: string;

      /**
       * The tax rate percentage, out of 100.
       */
      tax_rate_percentage: string | null;
    }
  }

  export interface Maximum {
    /**
     * List of price_ids that this maximum amount applies to. For plan/plan phase
     * maximums, this can be a subset of prices.
     */
    applies_to_price_ids: Array<string>;

    /**
     * Maximum amount applied
     */
    maximum_amount: string;
  }

  export interface Minimum {
    /**
     * List of price_ids that this minimum amount applies to. For plan/plan phase
     * minimums, this can be a subset of prices.
     */
    applies_to_price_ids: Array<string>;

    /**
     * Minimum amount applied
     */
    minimum_amount: string;
  }

  export interface ShippingAddress {
    city: string | null;

    country: string | null;

    line1: string | null;

    line2: string | null;

    postal_code: string | null;

    state: string | null;
  }

  export interface Subscription {
    id: string;
  }
}

export interface InvoiceCreateParams {
  /**
   * An ISO 4217 currency string. Must be the same as the customer's currency if it
   * is set.
   */
  currency: string;

  /**
   * Optional invoice date to set. Must be in the past, if not set, `invoice_date` is
   * set to the current time in the customer's timezone.
   */
  invoice_date: string;

  line_items: Array<InvoiceCreateParams.LineItem>;

  /**
   * Determines the difference between the invoice issue date for subscription
   * invoices as the date that they are due. A value of '0' here represents that the
   * invoice is due on issue, whereas a value of 30 represents that the customer has
   * 30 days to pay the invoice.
   */
  net_terms: number;

  /**
   * The id of the `Customer` to create this invoice for. One of `customer_id` and
   * `external_customer_id` are required.
   */
  customer_id?: string | null;

  /**
   * The `external_customer_id` of the `Customer` to create this invoice for. One of
   * `customer_id` and `external_customer_id` are required.
   */
  external_customer_id?: string | null;

  /**
   * An optional memo to attach to the invoice.
   */
  memo?: string | null;

  /**
   * When true, this invoice will automatically be issued upon creation. When false,
   * the resulting invoice will require manual review to issue. Defaulted to false.
   */
  will_auto_issue?: boolean;
}

export namespace InvoiceCreateParams {
  export interface LineItem {
    /**
     * A date string to specify the line item's end date in the customer's timezone.
     */
    end_date: string;

    item_id: string;

    model_type: 'unit';

    /**
     * The name of the line item.
     */
    name: string;

    /**
     * The number of units on the line item
     */
    quantity: number;

    /**
     * A date string to specify the line item's start date in the customer's timezone.
     */
    start_date: string;

    unit_config: LineItem.UnitConfig;
  }

  export namespace LineItem {
    export interface UnitConfig {
      /**
       * Rate per unit of usage
       */
      unit_amount: string;

      /**
       * Multiplier to scale rated quantity by
       */
      scaling_factor?: number | null;
    }
  }
}

export interface InvoiceListParams extends PageParams {
  amount?: string | null;

  'amount[gt]'?: string | null;

  'amount[lt]'?: string | null;

  customer_id?: string | null;

  date_type?: 'due_date' | 'invoice_date' | null;

  due_date?: string | null;

  due_date_window?: string | null;

  'due_date[gt]'?: string | null;

  'due_date[lt]'?: string | null;

  external_customer_id?: string | null;

  'invoice_date[gt]'?: string | null;

  'invoice_date[gte]'?: string | null;

  'invoice_date[lt]'?: string | null;

  'invoice_date[lte]'?: string | null;

  is_recurring?: boolean | null;

  status?: 'draft' | 'issued' | 'paid' | 'synced' | 'void' | null;

  subscription_id?: string | null;
}

export interface InvoiceFetchUpcomingParams {
  subscription_id?: string;
}

export interface InvoiceMarkPaidParams {
  /**
   * An optional external ID to associate with the payment.
   */
  external_id: string | null;

  /**
   * An optional note to associate with the payment.
   */
  notes: string | null;

  /**
   * A date string to specify the date of the payment.
   */
  payment_received_date: string;
}

export namespace Invoices {
  export import Invoice = InvoicesAPI.Invoice;
  export import InvoiceDiscount = InvoicesAPI.InvoiceDiscount;
  export import InvoiceFetchUpcomingResponse = InvoicesAPI.InvoiceFetchUpcomingResponse;
  export import InvoicesPage = InvoicesAPI.InvoicesPage;
  export import InvoiceCreateParams = InvoicesAPI.InvoiceCreateParams;
  export import InvoiceListParams = InvoicesAPI.InvoiceListParams;
  export import InvoiceFetchUpcomingParams = InvoicesAPI.InvoiceFetchUpcomingParams;
  export import InvoiceMarkPaidParams = InvoicesAPI.InvoiceMarkPaidParams;
}
