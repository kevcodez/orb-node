// File generated from our OpenAPI spec by Stainless.

import * as Core from 'orb-billing/core';
import { APIResource } from 'orb-billing/resource';
import { isRequestOptions } from 'orb-billing/core';
import * as CouponsAPI from 'orb-billing/resources/coupons/coupons';
import * as SubscriptionsAPI from 'orb-billing/resources/coupons/subscriptions';
import { Page, type PageParams } from 'orb-billing/pagination';

export class Coupons extends APIResource {
  subscriptions: SubscriptionsAPI.Subscriptions = new SubscriptionsAPI.Subscriptions(this.client);

  /**
   * This endpoint allows the creation of coupons, which can then be redeemed at
   * subscription creation or plan change.
   */
  create(body: CouponCreateParams, options?: Core.RequestOptions): Core.APIPromise<Coupon> {
    return this.post('/coupons', { body, ...options });
  }

  /**
   * This endpoint returns a list of all coupons for an account in a list format.
   *
   * The list of coupons is ordered starting from the most recently created coupon.
   * The response also includes `pagination_metadata`, which lets the caller retrieve
   * the next page of results if they exist. More information about pagination can be
   * found in the Pagination-metadata schema.
   */
  list(query?: CouponListParams, options?: Core.RequestOptions): Core.PagePromise<CouponsPage, Coupon>;
  list(options?: Core.RequestOptions): Core.PagePromise<CouponsPage, Coupon>;
  list(
    query: CouponListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.PagePromise<CouponsPage, Coupon> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this.getAPIList('/coupons', CouponsPage, { query, ...options });
  }

  /**
   * This endpoint allows a coupon to be archived. Archived coupons can no longer be
   * redeemed, and will be hidden from lists of active coupons. Additionally, once a
   * coupon is archived, its redemption code can be reused for a different coupon.
   */
  archive(couponId: string, options?: Core.RequestOptions): Core.APIPromise<Coupon> {
    return this.post(`/coupons/${couponId}/archive`, options);
  }

  /**
   * This endpoint retrieves a coupon by its ID. To fetch coupons by their redemption
   * code, use the [List coupons](list-coupons) endpoint with the redemption_code
   * parameter.
   */
  fetch(couponId: string, options?: Core.RequestOptions): Core.APIPromise<Coupon> {
    return this.get(`/coupons/${couponId}`, options);
  }
}

export class CouponsPage extends Page<Coupon> {}

/**
 * A coupon represents a reusable discount configuration, and have an attached
 * redemption code that can be issued to your end users. Coupons are most often
 * used in self-serve signup or upgrade flows in your checkout experience or
 * billing portal.
 *
 * To redeem a coupon, pass the `redemption_code` property in the
 * [create subscription](create-subscription.api.mdx) or
 * [schedule plan change](schedule-plan-change.api.mdx) request.
 */
export interface Coupon {
  /**
   * Also referred to as coupon_id in this documentation.
   */
  id: string;

  /**
   * An archived coupon can no longer be redeemed. Active coupons will have a value
   * of null for `archived_at`; this field will be non-null for archived coupons.
   */
  archived_at: string | null;

  discount: unknown;

  /**
   * This allows for a coupon's discount to apply for a limited time (determined in
   * months); a `null` value here means "unlimited time".
   */
  duration_in_months: number | null;

  /**
   * The maximum number of redemptions allowed for this coupon before it is
   * exhausted; `null` here means "unlimited".
   */
  max_redemptions: number | null;

  /**
   * This string can be used to redeem this coupon for a given subscription.
   */
  redemption_code: string;

  /**
   * The number of times this coupon has been redeemed.
   */
  times_redeemed: number;
}

export interface CouponCreateParams {
  discount: unknown;

  /**
   * This string can be used to redeem this coupon for a given subscription.
   */
  redemption_code: string;

  /**
   * This allows for a coupon's discount to apply for a limited time (determined in
   * months); a `null` value here means "unlimited time".
   */
  duration_in_months?: number | null;

  /**
   * The maximum number of redemptions allowed for this coupon before it is
   * exhausted;`null` here means "unlimited".
   */
  max_redemptions?: number | null;
}

export interface CouponListParams extends PageParams {
  /**
   * Filter to coupons matching this redemption code.
   */
  redemption_code?: string | null;

  /**
   * Show archived coupons as well (by default, this endpoint only returns active
   * coupons).
   */
  show_archived?: boolean | null;
}

export namespace Coupons {
  export import Coupon = CouponsAPI.Coupon;
  export import CouponsPage = CouponsAPI.CouponsPage;
  export import CouponCreateParams = CouponsAPI.CouponCreateParams;
  export import CouponListParams = CouponsAPI.CouponListParams;
  export import Subscriptions = SubscriptionsAPI.Subscriptions;
  export import SubscriptionListParams = SubscriptionsAPI.SubscriptionListParams;
}
