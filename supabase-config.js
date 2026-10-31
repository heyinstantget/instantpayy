
// Instant Pay Supabase Configuration
var InstantPayDB;

(function () {
  'use strict';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Supabase JS library did not load.');

    InstantPayDB = window.InstantPayDB = {
      ready: false,
      error: 'Supabase library did not load.'
    };
    return;
  }

  var SUPABASE_URL = 'https://unsqcyjkiqhantwozbbc.supabase.co';

  var SUPABASE_ANON_KEY = 'sb_publishable_SrHHt-FNLQhpCmcuGAkQpA_IS6ou_2J';

  var supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  window.supabaseClient = supabaseClient;

  var db = {
    ready: true,

    async user() {
      var result = await supabaseClient.auth.getUser();
      if (result.error) throw result.error;
      if (!result.data.user) throw new Error('Please log in first.');
      return result.data.user;
    },

    async createOrder(args) {
      await this.user();

      var result = await supabaseClient.rpc('member_create_order', {
        p_order_no: String(args.orderNo),
        p_order_type: String(args.type),
        p_amount: Number(args.amount),
        p_utr: args.utr == null ? null : String(args.utr)
      });

      if (result.error) throw result.error;
      return result.data;
    },

    async myOrders() {
      var user = await this.user();

      var result = await supabaseClient
        .from('orders')
        .select('*')
        .eq('member_id', user.id)
        .order('created_at', { ascending: false });

      if (result.error) throw result.error;
      return result.data || [];
    },

    async myProfile() {
      var user = await this.user();

      var result = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (result.error) throw result.error;
      return result.data;
    }
  };

  InstantPayDB = window.InstantPayDB = db;

  window.dispatchEvent(new Event('instantpaydb:ready'));

  console.info('Instant Pay Supabase helpers loaded.');
})();
