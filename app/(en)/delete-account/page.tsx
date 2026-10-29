import type { Metadata } from "next";
import Crumbs, { crumbSchema } from "@/components/Crumbs";
import JsonLd from "@/components/JsonLd";
import { LEGAL, NAME, SUPPORT_EMAIL } from "@/lib/site";

const PATH = "/delete-account/";
const DESCRIPTION = `How to delete your ${NAME} account and every photo, credit and booth stored with it.`;

export const metadata: Metadata = {
  title: "Delete your account",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `Delete your account · ${NAME}`, description: DESCRIPTION, url: PATH },
};

export default function DeleteAccount() {
  return (
    <div className="article sp">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [crumbSchema([{ name: "Delete your account", path: PATH }])] }} />
      <header className="sp-head">
        <div className="sp-glow" aria-hidden="true" />
        <Crumbs trail={[{ name: "Delete your account", path: PATH }]} />
        <h1>Delete your <em>account</em></h1>
        <p className="lede">{DESCRIPTION} You can do it yourself in the app, or ask us to do it.</p>
      </header>

      <section className="section-tight" aria-labelledby="in-app">
        <h2 id="in-app">Delete it in the app</h2>
        <ol>
          <li>Open {NAME} and go to <b>Settings</b>.</li>
          <li>Tap <b>Delete my data</b>.</li>
          <li>Confirm <b>Delete everything</b>.</li>
        </ol>
        <p>The deletion happens immediately and can&apos;t be undone.</p>
      </section>

      <section className="section-tight" aria-labelledby="by-email">
        <h2 id="by-email">Can&apos;t open the app?</h2>
        <p>
          Email <a href={`mailto:${SUPPORT_EMAIL}?subject=Delete%20my%20Flashbae%20account`}>{SUPPORT_EMAIL}</a> from
          the address you use with {NAME} (or tell us the email on your Google sign-in) with the subject
          &ldquo;Delete my Flashbae account&rdquo;. We delete the account and its data within 30 days and reply once it is done.
        </p>
      </section>

      <section className="section-tight" aria-labelledby="what">
        <h2 id="what">What gets deleted</h2>
        <ul>
          <li>Your credits, plan record and purchase history in our database.</li>
          <li>Every photo and AI result stored in your Library.</li>
          <li>Your booths with friends, including your frames and seat.</li>
          <li>Your push notification token and the answers to the optional questions you were asked.</li>
        </ul>
        <h3>What we may keep</h3>
        <ul>
          <li>Purchase records held by Google Play, Apple and RevenueCat under their own policies and tax rules.</li>
          <li>Anonymous usage analytics that can no longer be tied to you once your identifier is deleted.</li>
        </ul>
        <p>
          Deleting your data does not cancel a subscription. Cancel it in Google Play (Menu → Subscriptions) or your Apple ID
          settings first, otherwise it keeps renewing. See the <a href={LEGAL.privacy}>Privacy Policy</a> for details.
        </p>
      </section>
    </div>
  );
}
