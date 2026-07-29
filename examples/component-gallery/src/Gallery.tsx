import { ArrowRight, Check, Search } from 'lucide-react';
import type { CSSProperties } from 'react';

import { Button, Card, Link, SectionShell } from '../../../components';
import { AnnotatedScreen } from './compositions/AnnotatedScreen';
import { FindingsCard, type FindingSeverity } from './compositions/FindingsCard';
import { PriorityMap } from './compositions/PriorityMap';

const annotations = [
  { detail: 'The destination is unclear until after activation.', title: 'Name the destination' },
  { detail: 'Status is separated from the account heading.', title: 'Rejoin related information' },
  { detail: 'Two actions compete with the primary review task.', title: 'Reduce competing actions' },
] as const;

const priorities = [
  { effort: 'Low' as const, severity: 'Critical' as const, title: 'Restore renewal confirmation' },
  { effort: 'Medium' as const, severity: 'High' as const, title: 'Clarify the account summary' },
  { effort: 'High' as const, severity: 'Medium' as const, title: 'Consolidate secondary metadata' },
] as const;

const findingSurfaces = [
  { severity: 'High' as FindingSeverity, surface: 'default' as const, title: 'Light surface' },
  { severity: 'Medium' as FindingSeverity, surface: 'subtle-emphasis' as const, title: 'Subtle surface' },
  { severity: 'Critical' as FindingSeverity, surface: 'inverse' as const, title: 'Inverse surface' },
] as const;

const evidence = {
  evidence: 'Seven of twelve review participants missed the account control.',
  impact: 'Customers cannot confirm their billing contact before renewal.',
  problem: 'The account control is visually detached from its heading.',
  recommendation: 'Move the control into the summary and name the action directly.',
} as const;

const surfaces = ['default', 'subtle-emphasis', 'inverse'] as const;

const admittedPairs = [
  ['Charcoal / off-white', 'charcoal', 'off-white'],
  ['Charcoal / white', 'charcoal', 'white'],
  ['Slate / off-white', 'slate', 'off-white'],
  ['Off-white / slate', 'off-white', 'slate'],
  ['White / slate', 'white', 'slate'],
  ['Teal / off-white', 'teal', 'off-white'],
  ['Teal / white', 'teal', 'white'],
  ['Off-white / teal', 'off-white', 'teal'],
  ['White / teal', 'white', 'teal'],
  ['Rust / off-white', 'rust', 'off-white'],
  ['White / rust', 'white', 'rust'],
  ['Mid / off-white', 'mid', 'off-white'],
  ['Mid / white', 'mid', 'white'],
  ['Charcoal / teal-100', 'charcoal', 'teal-100'],
  ['Slate / teal-100', 'slate', 'teal-100'],
  ['Teal-100 / slate', 'teal-100', 'slate'],
] as const;

const prohibitedPairs = [
  ['Teal / slate', 'teal', 'slate'],
  ['Light / off-white', 'light', 'off-white'],
  ['Teal / teal-100', 'teal', 'teal-100'],
  ['Teal-100 / off-white', 'teal-100', 'off-white'],
] as const;

const colorVariables = {
  charcoal: 'var(--rf-color-primitive-neutral-charcoal)',
  light: 'var(--rf-color-primitive-neutral-light)',
  mid: 'var(--rf-color-primitive-neutral-mid)',
  'off-white': 'var(--rf-color-primitive-neutral-off-white)',
  rust: 'var(--rf-color-primitive-brand-rust)',
  slate: 'var(--rf-color-primitive-brand-slate)',
  teal: 'var(--rf-color-primitive-brand-teal)',
  'teal-100': 'var(--rf-color-primitive-accent-teal-100)',
  white: 'var(--rf-color-primitive-neutral-white)',
} as const;

function pairStyle(foreground: keyof typeof colorVariables, background: keyof typeof colorVariables) {
  return {
    '--gallery-pair-background': colorVariables[background],
    '--gallery-pair-foreground': colorVariables[foreground],
  } as CSSProperties;
}

export function Gallery() {
  return (
    <>
      <header className="gallery-header">
        <div className="rf-container rf-container--standard">
          <p className="gallery-kicker">Ridgeframe design system · v0.1.0</p>
          <h1>Component gallery</h1>
          <p className="gallery-intro">
            A review surface for primitive states, evidence patterns, responsive anchors, and accessibility decisions.
          </p>
          <nav aria-label="Responsive review anchors" className="gallery-review-nav">
            <Link href="#review-mobile" variant="navigation">Mobile · 0–767px</Link>
            <Link href="#review-tablet" variant="navigation">Tablet · 768–1023px</Link>
            <Link href="#review-desktop" variant="navigation">Desktop · 1024–1439px</Link>
            <Link href="#review-wide" variant="navigation">Wide · 1440px+</Link>
          </nav>
        </div>
      </header>

      <main>
        <SectionShell data-teal-budget="3" framed heading="Review anchors" id="review-anchors" surface="raised">
          <div className="gallery-anchor-grid">
            {[
              ['review-mobile', 'Mobile', '0–767px', 'One column; priority map becomes a linear list.'],
              ['review-tablet', 'Tablet', '768–1023px', 'Eight-column foundation; evidence pairs may sit side by side.'],
              ['review-desktop', 'Desktop', '1024–1439px', 'Twelve-column foundation; bounded asymmetry is available.'],
              ['review-wide', 'Wide', '1440px+', 'Twelve columns within the 1280px maximum container.'],
            ].map(([id, name, range, guidance]) => (
              <Card as="article" id={id} key={id} padding="compact">
                <h3>{name}</h3>
                <p className="gallery-utility">{range}</p>
                <p>{guidance}</p>
              </Card>
            ))}
          </div>
        </SectionShell>

        <SectionShell data-teal-budget="3" heading="Button">
          <p className="gallery-section-intro">Use Tab to focus; hover and press the enabled examples to review native states.</p>
          <div className="gallery-state-grid">
            <div><span>Primary</span><Button icon={<Search />}>Review evidence</Button></div>
            <div><span>Secondary</span><Button icon={<ArrowRight />} iconPosition="trailing" variant="secondary">View details</Button></div>
            <div><span>Tertiary</span><Button icon={<Check />} variant="tertiary">Mark reviewed</Button></div>
            <div><span>Hover</span><Button className="gallery-force-button-hover" variant="secondary">Hover state</Button></div>
            <div><span>Focus-visible</span><Button className="gallery-force-button-focus" variant="secondary">Focus state</Button></div>
            <div><span>Active</span><Button className="gallery-force-button-active" variant="secondary">Pressed state</Button></div>
            <div><span>Loading</span><Button loading>Loading state</Button></div>
            <div><span>Disabled</span><Button disabled>Disabled state</Button></div>
          </div>
        </SectionShell>

        <SectionShell data-teal-budget="3" data-teal-signal="persistent" framed heading="Link" surface="subtle-emphasis">
          <div className="gallery-link-grid">
            <p>Inline links remain in editorial flow: <Link href="#color-decisions">review color decisions</Link>.</p>
            <p><Link href="#evidence-compositions" variant="standalone">Standalone evidence link</Link></p>
            <p><Link current href="#review-anchors" variant="navigation">Current navigation link</Link></p>
            <p><Link href="https://example.com" newContext variant="standalone">External reference</Link></p>
            <Card border="none" className="gallery-inverse-link" surface="inverse">
              <Link href="#keyboard-motion" variant="inverse">Inverse surface link</Link>
            </Card>
            <p><Link className="gallery-force-link-focus" href="#link-focus">Forced focus-visible review</Link></p>
          </div>
        </SectionShell>

        <SectionShell data-teal-budget="3" heading="Card">
          <div className="gallery-card-grid">
            <Card border="none" padding="none"><h3>No border · no padding</h3><p>Structural content can inherit its surrounding rhythm.</p></Card>
            <Card border="structural" padding="compact"><h3>Structural · compact</h3><p>A quiet evidence boundary.</p></Card>
            <Card border="control"><h3>Control · default</h3><p>A stronger edge for actionable regions.</p></Card>
            <Card interactive padding="spacious" surface="raised"><h3>Raised · spacious</h3><p>Hover reveals the interactive border state.</p></Card>
            <Card data-teal-signal="persistent" surface="subtle-emphasis"><h3>Subtle emphasis</h3><p>Charcoal text on teal-100 is admitted.</p></Card>
            <Card surface="inverse"><h3>Inverse</h3><p>White text on slate preserves contrast.</p></Card>
          </div>
        </SectionShell>

        <SectionShell data-teal-budget="3" framed heading="SectionShell" surface="raised" width="maximum">
          <div className="gallery-shell-grid">
            <SectionShell className="gallery-mini-shell" framed label="Default reading-width SectionShell" width="reading">
              <h3>Default · reading</h3><p>Editorial measure and standard surface.</p>
            </SectionShell>
            <SectionShell className="gallery-mini-shell" data-teal-signal="persistent" framed label="Subtle standard-width SectionShell" surface="subtle-emphasis">
              <h3>Subtle · standard</h3><p>A restrained emphasis field.</p>
            </SectionShell>
            <SectionShell className="gallery-mini-shell" framed label="Inverse maximum-width SectionShell" surface="inverse" width="maximum">
              <h3>Inverse · maximum</h3><p>A high-contrast structural band.</p>
            </SectionShell>
          </div>
        </SectionShell>

        <SectionShell heading="Evidence compositions" id="evidence-compositions" width="maximum">
          <p className="gallery-section-intro">Gallery-local patterns built from shipped primitives; none are public exports.</p>

          <section aria-labelledby="findings-heading" className="gallery-composition-group" data-teal-budget="3">
            <h3 id="findings-heading">Findings Card</h3>
            <div className="gallery-composition-grid">
              {findingSurfaces.map((item) => (
                <FindingsCard {...evidence} key={item.surface} severity={item.severity} surface={item.surface} title={item.title} />
              ))}
            </div>
          </section>

          <section aria-labelledby="annotated-heading" className="gallery-composition-group" data-teal-budget="3">
            <h3 id="annotated-heading">Annotated Screen</h3>
            <div className="gallery-composition-grid">
              {surfaces.map((surface) => (
                <AnnotatedScreen
                  annotations={annotations}
                  caption="Neutral CSS-rendered account interface used only to review hierarchy and labeling."
                  key={surface}
                  surface={surface}
                  title={`${surface === 'subtle-emphasis' ? 'Subtle' : surface[0].toUpperCase() + surface.slice(1)} surface`}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="priority-heading" className="gallery-composition-group" data-teal-budget="3">
            <h3 id="priority-heading">Priority Map</h3>
            <div className="gallery-composition-grid">
              {surfaces.map((surface) => (
                <PriorityMap items={priorities} key={surface} surface={surface} title={`${surface === 'subtle-emphasis' ? 'Subtle' : surface[0].toUpperCase() + surface.slice(1)} surface`} />
              ))}
            </div>
          </section>
        </SectionShell>

        <SectionShell data-teal-budget="3" framed heading="Keyboard and motion review" id="keyboard-motion" surface="inverse">
          <div className="gallery-guidance-grid">
            <Card surface="inverse">
              <h3>Keyboard</h3>
              <p>Use Tab and Shift+Tab in source order. Activate links with Enter and buttons with Space or Enter. Focus must remain fully visible.</p>
            </Card>
            <Card surface="inverse">
              <h3>Reduced motion</h3>
              <p>Enable prefers-reduced-motion: reduce. Transitions and the loading spinner resolve to the zero-duration token while status text remains available.</p>
            </Card>
            <Card surface="inverse">
              <h3>Reading order</h3>
              <p>At mobile width, confirm annotations follow the sample and the Priority Map uses its explicit linear fallback.</p>
            </Card>
          </div>
        </SectionShell>

        <SectionShell heading="Color-pair decisions" id="color-decisions" width="maximum">
          <div className="gallery-color-columns">
            <section aria-labelledby="admitted-heading">
              <h3 id="admitted-heading">Admitted pairs</h3>
              <p>These declared foreground/background combinations pass their assigned contrast requirement.</p>
              <ul className="gallery-pair-list">
                {admittedPairs.map(([label, foreground, background]) => (
                  <li key={label} style={pairStyle(foreground, background)}>
                    <span aria-hidden="true" className="gallery-pair-sample">Aa</span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="prohibited-heading">
              <h3 id="prohibited-heading">Prohibited pairs</h3>
              <p>Swatches are decorative; labels carry the decision without presenting inaccessible sample text.</p>
              <ul className="gallery-pair-list gallery-pair-list--prohibited">
                {prohibitedPairs.map(([label, foreground, background]) => (
                  <li key={label} style={pairStyle(foreground, background)}>
                    <span aria-hidden="true" className="gallery-pair-swatch" />
                    <span>{label} · do not use</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </SectionShell>
      </main>
    </>
  );
}
