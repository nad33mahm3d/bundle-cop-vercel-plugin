'use client'

import moment from 'moment'

export default function Page() {
  const today = moment().format('MMMM Do YYYY')
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>Bundle Cop Example</h1>
      <p>
        Today is <strong>{today}</strong> (via <code>moment</code>).
      </p>
      <p>
        Build this app to verify attribution: moment should point back to this
        page.
      </p>
    </main>
  )
}
