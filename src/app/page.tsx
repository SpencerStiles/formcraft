import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .fc-body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif; background: #fff; color: #111827; }
        .fc-nav { position: sticky; top: 0; z-index: 50; border-bottom: 1px solid #f3f4f6; background: rgba(255,255,255,0.94); backdrop-filter: blur(8px); }
        .fc-nav-inner { max-width: 1080px; margin: 0 auto; padding: 0 24px; height: 56px; display: flex; align-items: center; justify-content: space-between; }
        .fc-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .fc-logo-gem { font-size: 22px; line-height: 1; }
        .fc-logo-text { color: #111827; font-size: 16px; font-weight: 800; letter-spacing: -0.03em; }
        .fc-logo-text em { color: #f97316; font-style: normal; }
        .fc-nav-links { display: flex; gap: 28px; list-style: none; }
        .fc-nav-links a { color: #6b7280; font-size: 14px; text-decoration: none; }
        .fc-nav-links a:hover { color: #f97316; }
        .fc-open-btn { background: #f97316; color: #fff; border-radius: 50px; padding: 8px 20px; font-size: 13px; text-decoration: none; font-weight: 700; letter-spacing: -0.01em; }
        .fc-open-btn:hover { background: #ea580c; }

        /* HERO */
        .fc-hero { padding: 80px 24px 0; overflow: hidden; }
        .fc-hero-inner { max-width: 1080px; margin: 0 auto; }
        .fc-hero-text { text-align: center; max-width: 720px; margin: 0 auto 60px; }
        .fc-pill { display: inline-flex; align-items: center; gap: 8px; background: #fff7ed; border-radius: 50px; padding: 5px 16px; margin-bottom: 28px; border: 1px solid #fed7aa; }
        .fc-pill-text { color: #ea580c; font-size: 12px; font-weight: 600; }
        .fc-h1 { font-size: clamp(40px, 6vw, 68px); font-weight: 900; line-height: 1.05; letter-spacing: -0.05em; color: #111827; margin-bottom: 20px; }
        .fc-h1 span { color: #f97316; }
        .fc-subtitle { color: #6b7280; font-size: 18px; line-height: 1.65; margin-bottom: 40px; }
        .fc-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; align-items: center; }
        .fc-cta-primary { background: #f97316; color: #fff; border-radius: 50px; padding: 14px 32px; font-size: 16px; text-decoration: none; font-weight: 800; letter-spacing: -0.02em; }
        .fc-cta-primary:hover { background: #ea580c; }
        .fc-cta-ghost { color: #6b7280; font-size: 14px; text-decoration: none; padding: 14px 4px; }
        .fc-cta-ghost:hover { color: #374151; }

        /* Form mockup */
        .fc-mockup-wrap { margin-top: 56px; background: #f9fafb; border-top: 1px solid #f3f4f6; border-radius: 24px 24px 0 0; padding: 40px 24px 0; display: flex; justify-content: center; }
        .fc-mockup { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); width: 100%; max-width: 560px; overflow: hidden; }
        .fc-mockup-bar { background: #f3f4f6; padding: 10px 16px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #e5e7eb; }
        .fc-mockup-dot { width: 8px; height: 8px; border-radius: 50%; }
        .fc-mockup-title { font-size: 12px; color: #9ca3af; margin: 0 auto; font-weight: 500; }
        .fc-form-preview { padding: 32px 28px; }
        .fc-form-q { margin-bottom: 24px; }
        .fc-form-label { font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 10px; display: block; }
        .fc-form-label .fc-req { color: #f97316; margin-left: 2px; }
        .fc-form-input { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 11px 14px; font-size: 14px; color: #111827; font-family: inherit; }
        .fc-form-input:focus { outline: none; border-color: #f97316; }
        .fc-form-choices { display: flex; flex-direction: column; gap: 8px; }
        .fc-choice { display: flex; align-items: center; gap: 10px; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 10px 14px; font-size: 14px; color: #374151; }
        .fc-choice.selected { border-color: #f97316; background: #fff7ed; color: #ea580c; font-weight: 600; }
        .fc-choice-radio { width: 16px; height: 16px; border: 2px solid #d1d5db; border-radius: 50%; flex-shrink: 0; }
        .fc-choice.selected .fc-choice-radio { border-color: #f97316; background: #f97316; }
        .fc-submit-btn { display: block; width: 100%; background: #f97316; color: #fff; border: none; border-radius: 10px; padding: 13px; font-size: 15px; font-weight: 700; text-align: center; margin-top: 8px; font-family: inherit; }

        /* FIELD TYPES */
        .fc-fields { background: #fff; padding: 96px 24px; border-top: 1px solid #f3f4f6; }
        .fc-section-inner { max-width: 1080px; margin: 0 auto; }
        .fc-eyebrow { color: #f97316; font-size: 12px; letter-spacing: 0.12em; margin-bottom: 12px; text-transform: uppercase; font-weight: 600; }
        .fc-h2 { color: #111827; font-size: clamp(28px, 4vw, 44px); font-weight: 900; letter-spacing: -0.04em; margin-bottom: 56px; line-height: 1.1; }
        .fc-types-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
        .fc-type-chip { border: 1.5px solid #f3f4f6; border-radius: 12px; padding: 16px 14px; text-align: center; background: #fff; }
        .fc-type-chip:hover { border-color: #fed7aa; background: #fff7ed; }
        .fc-type-icon { font-size: 22px; margin-bottom: 8px; }
        .fc-type-name { font-size: 12px; font-weight: 600; color: #374151; }

        /* HOW IT WORKS */
        .fc-how { background: #fff7ed; padding: 96px 24px; border-top: 1px solid #fed7aa; }
        .fc-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 48px; margin-top: 0; }
        .fc-step-num { font-size: 48px; font-weight: 900; color: #fed7aa; letter-spacing: -0.04em; line-height: 1; margin-bottom: 12px; }
        .fc-step-title { font-size: 17px; font-weight: 800; color: #111827; margin-bottom: 8px; letter-spacing: -0.02em; }
        .fc-step-desc { font-size: 14px; color: #9a6632; line-height: 1.65; }

        /* CTA BLOCK */
        .fc-cta-block { background: #f97316; padding: 80px 24px; }
        .fc-cta-inner { max-width: 700px; margin: 0 auto; text-align: center; }
        .fc-cta-h2 { color: #fff; font-size: clamp(28px, 5vw, 52px); font-weight: 900; letter-spacing: -0.04em; margin-bottom: 16px; line-height: 1.1; }
        .fc-cta-sub { color: rgba(255,255,255,0.75); font-size: 17px; margin-bottom: 36px; }
        .fc-cta-btn-white { display: inline-block; background: #fff; color: #f97316; border-radius: 50px; padding: 14px 36px; font-size: 16px; text-decoration: none; font-weight: 800; letter-spacing: -0.02em; }
        .fc-cta-btn-white:hover { background: #fff7ed; }

        /* FOOTER */
        .fc-footer { background: #111827; padding: 36px 24px; }
        .fc-footer-inner { max-width: 1080px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .fc-footer-brand { color: #6b7280; font-size: 14px; }
        .fc-footer-brand strong { color: #f9fafb; }
        .fc-footer-links { display: flex; gap: 20px; }
        .fc-footer-links a { color: #6b7280; font-size: 13px; text-decoration: none; }
        .fc-footer-links a:hover { color: #9ca3af; }
      `}</style>

      <div className="fc-body">
        {/* NAV */}
        <nav className="fc-nav">
          <div className="fc-nav-inner">
            <a href="/" className="fc-logo">
              <span className="fc-logo-gem">◆</span>
              <span className="fc-logo-text">Form<em>Craft</em></span>
            </a>
            <ul className="fc-nav-links">
              <li><a href="#fields">Fields</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="https://github.com/SpencerStiles/formcraft">GitHub</a></li>
            </ul>
            <Link href="/dashboard" className="fc-open-btn">
              Build a Form →
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="fc-hero">
          <div className="fc-hero-inner">
            <div className="fc-hero-text">
              <div className="fc-pill">
                <span className="fc-pill-text">Free · Open Source · No account needed</span>
              </div>
              <h1 className="fc-h1">
                Forms that people<br />
                <span>actually finish.</span>
              </h1>
              <p className="fc-subtitle">
                Build Typeform-style forms in minutes. 10 field types, conditional logic,
                response tracking. Beautiful by default.
              </p>
              <div className="fc-ctas">
                <Link href="/dashboard" className="fc-cta-primary">
                  Start Building Free
                </Link>
                <a href="https://github.com/SpencerStiles/formcraft" className="fc-cta-ghost">
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Form mockup */}
            <div className="fc-mockup-wrap">
              <div className="fc-mockup">
                <div className="fc-mockup-bar">
                  <div className="fc-mockup-dot" style={{ background: '#f87171' }} />
                  <div className="fc-mockup-dot" style={{ background: '#fbbf24' }} />
                  <div className="fc-mockup-dot" style={{ background: '#34d399' }} />
                  <span className="fc-mockup-title">Customer Satisfaction</span>
                </div>
                <div className="fc-form-preview">
                  <div className="fc-form-q">
                    <label className="fc-form-label">
                      What is your name?<span className="fc-req">*</span>
                    </label>
                    <input
                      type="text"
                      className="fc-form-input"
                      placeholder="Jane Smith"
                      readOnly
                    />
                  </div>
                  <div className="fc-form-q">
                    <label className="fc-form-label">
                      How would you rate your experience?<span className="fc-req">*</span>
                    </label>
                    <div className="fc-form-choices">
                      {[
                        { label: 'Excellent', selected: true },
                        { label: 'Good', selected: false },
                        { label: 'Needs improvement', selected: false },
                      ].map((choice) => (
                        <div key={choice.label} className={`fc-choice${choice.selected ? ' selected' : ''}`}>
                          <div className="fc-choice-radio" />
                          {choice.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="fc-submit-btn" type="button">
                    Submit Response →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FIELD TYPES */}
        <section id="fields" className="fc-fields">
          <div className="fc-section-inner">
            <p className="fc-eyebrow">10 field types</p>
            <h2 className="fc-h2">Everything you need to build it.</h2>
            <div className="fc-types-grid">
              {[
                { icon: '✏️', name: 'Short Text' },
                { icon: '📝', name: 'Long Text' },
                { icon: '📧', name: 'Email' },
                { icon: '📞', name: 'Phone' },
                { icon: '🔢', name: 'Number' },
                { icon: '⭕', name: 'Radio' },
                { icon: '☑️', name: 'Checkbox' },
                { icon: '▾', name: 'Dropdown' },
                { icon: '⭐', name: 'Rating' },
                { icon: '📅', name: 'Date' },
              ].map((type) => (
                <div key={type.name} className="fc-type-chip">
                  <div className="fc-type-icon">{type.icon}</div>
                  <div className="fc-type-name">{type.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="fc-how">
          <div className="fc-section-inner">
            <p className="fc-eyebrow">How it works</p>
            <h2 className="fc-h2">Three steps, done.</h2>
            <div className="fc-steps">
              {[
                {
                  num: '01',
                  title: 'Drag & drop fields',
                  desc: 'Pick from 10 field types. Reorder with drag-and-drop. Mark fields required or optional.',
                },
                {
                  num: '02',
                  title: 'Publish in one click',
                  desc: 'Toggle publish when ready. Share the link anywhere — no login required to fill.',
                },
                {
                  num: '03',
                  title: 'View responses',
                  desc: 'Every submission captured instantly. Browse responses in a clean table view.',
                },
              ].map((step) => (
                <div key={step.num}>
                  <div className="fc-step-num">{step.num}</div>
                  <h3 className="fc-step-title">{step.title}</h3>
                  <p className="fc-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOLD CTA BLOCK */}
        <section className="fc-cta-block">
          <div className="fc-cta-inner">
            <h2 className="fc-cta-h2">Your first form is five minutes away.</h2>
            <p className="fc-cta-sub">
              No account. No credit card. No templates to fight with.
              Just an empty canvas and 10 field types.
            </p>
            <Link href="/dashboard" className="fc-cta-btn-white">
              Build Your Form →
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="fc-footer">
          <div className="fc-footer-inner">
            <span className="fc-footer-brand"><strong>FormCraft</strong> · Open source form builder</span>
            <div className="fc-footer-links">
              <a href="https://github.com/SpencerStiles/formcraft">GitHub</a>
              <a href="/dashboard">Open App</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
