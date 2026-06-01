export default function StrategyPage() {
  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        Mediahubink Strategy
      </h1>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="border rounded-2xl p-6">
          <h2 className="font-semibold mb-2">Revenue Goal</h2>
          <p className="text-3xl font-bold">£25,500</p>
        </div>

        <div className="border rounded-2xl p-6">
          <h2 className="font-semibold mb-2">Current MRR</h2>
          <p className="text-3xl font-bold">£0</p>
        </div>

        <div className="border rounded-2xl p-6">
          <h2 className="font-semibold mb-2">Gap</h2>
          <p className="text-3xl font-bold">£25,500</p>
        </div>
      </div>

      <div className="space-y-8">

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Primary Verticals
          </h2>

          <ul className="list-disc ml-6">
            <li>Trades</li>
            <li>Dental</li>
            <li>Estate Agents</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Secondary Verticals
          </h2>

          <ul className="list-disc ml-6">
            <li>Schools</li>
            <li>Serviced Offices</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Strategic Markets
          </h2>

          <ul className="list-disc ml-6">
            <li>United Kingdom</li>
            <li>SADC Region</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Positioning
          </h2>

          <blockquote className="border-l-4 pl-4 italic">
            I build AI agents that do the repetitive work your
            front-of-house staff shouldn't be doing, so you stop
            losing leads at 10pm and start conversations you
            didn't have to start yourself.
          </blockquote>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Business Rule
          </h2>

          <div className="border rounded-xl p-6">
            <p>
              Everything in Mediahubink must support:
            </p>

            <ol className="list-decimal ml-6 mt-3">
              <li>Revenue</li>
              <li>Relationships</li>
              <li>Reputation</li>
            </ol>

            <p className="mt-4 font-medium">
              If it supports none of these,
              do not spend time on it.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
