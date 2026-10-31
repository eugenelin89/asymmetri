"use client";
import { useEffect, useState } from "react";
import {
  affiliations,
  communityZones,
  shirtColors,
  type ProfileDraft,
  type PublicProfile,
} from "./model";
import styles from "../campus.module.css";
const blank: ProfileDraft = {
  name: "",
  affiliation: "Visitor",
  department: "",
  about: "",
  interests: "",
  advice: "",
  zone: "nest",
  color: "teal",
};
async function request(path: string, method = "GET", value?: unknown) {
  const response = await fetch(`/labs/ubc/community-api/${path}`, {
    method,
    cache: "no-store",
    headers: value ? { "Content-Type": "application/json" } : undefined,
    body: value ? JSON.stringify(value) : undefined,
  });
  const data = await response.json().catch(() => {
    throw new Error("Profiles are temporarily unavailable. Please try again.");
  });
  if (!response.ok)
    throw new Error(data.error || "The request could not be completed.");
  return data;
}
export function ProfilePanel({ onChange }: { onChange: () => void }) {
  const [draft, setDraft] = useState<ProfileDraft>(blank),
    [profile, setProfile] = useState<PublicProfile | null>(null),
    [hidden, setHidden] = useState(false),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(true),
    [message, setMessage] = useState(""),
    [code, setCode] = useState(""),
    [recover, setRecover] = useState(""),
    [remove, setRemove] = useState(false);
  useEffect(() => {
    let live = true;
    request("profile")
      .then((v) => {
        if (live) {
          setProfile(v.profile);
          setHidden(!!v.hidden);
          if (v.profile) setDraft(v.profile);
        }
      })
      .catch((e) => {
        if (live) setMessage(e.message);
      })
      .finally(() => {
        if (live) setBusy(false);
      });
    return () => {
      live = false;
    };
  }, []);
  const update = (patch: Partial<ProfileDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));
  const action = async (run: () => Promise<void>) => {
    setBusy(true);
    setMessage("");
    try {
      await run();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <span className={styles.badge}>COMMUNITY · OPT IN</span>
      <h2>{profile ? "Your campus character." : "Join the campus."}</h2>
      <p>
        Create a public character representing yourself. Other visitors can meet
        it and read the answers you write. This is an asynchronous character,
        not live multiplayer.
      </p>
      <p className={styles.disclaimer}>
        Use a first name or nickname. Your profile and answers are public
        immediately; identity and university affiliation are self-described.
        Choose a virtual meeting area, never a real room or current location. Do
        not include contact details or another person’s information.
      </p>
      <details>
        <summary>Profile privacy and removal</summary>
        <p>
          Your submitted fields are stored on Asymmetri’s server and publicly
          readable until you remove the profile. A private browser cookie lets
          you edit or delete it; a hashed recovery credential is stored on the
          server. Reports are private to the operator and retained for up to 90
          days. Short-lived hashed request identifiers limit abuse; ordinary
          hosting logs may include IP addresses. No location tracking or
          portrait uploads are used. Removal deletes the active profile and
          associated reports; it cannot recall copies others saved. For
          moderation or recovery assistance, email info@asymmetri.co without
          sending your recovery code.
        </p>
      </details>
      {message && <p role="status">{message}</p>}
      {hidden && (
        <p role="alert">
          This profile has been removed by moderation. You can still remove your
          stored profile below.
        </p>
      )}
      {code && (
        <section
          className={styles.recovery}
          aria-label="Private profile recovery code"
        >
          <h3>Save your private recovery code</h3>
          <p>
            This browser can manage your profile. Keep this code privately to
            regain access elsewhere; it grants editing and removal access. It is
            shown only now.
          </p>
          <textarea readOnly aria-label="Private recovery code" value={code} />
          <p>
            Without this browser or your code, automatic recovery is
            unavailable.
          </p>
          <button onClick={() => setCode("")}>I saved it privately</button>
        </section>
      )}
      <form
        className={styles.profileForm}
        onSubmit={(e) => {
          e.preventDefault();
          void action(async () => {
            const v = await request("profile", profile ? "PATCH" : "POST", {
              ...draft,
              consent,
            });
            setProfile(v.profile);
            setDraft(v.profile);
            setConsent(false);
            if (v.recoveryCode) setCode(v.recoveryCode);
            setMessage(
              "Your public character is published. Visitors can meet it in your selected area.",
            );
            onChange();
          });
        }}
      >
        <fieldset disabled={busy || hidden}>
          <label>
            Public name
            <input
              required
              minLength={2}
              maxLength={50}
              value={draft.name}
              onChange={(e) => update({ name: e.target.value })}
              autoComplete="off"
            />
          </label>
          <label>
            Self-described affiliation
            <select
              value={draft.affiliation}
              onChange={(e) =>
                update({
                  affiliation: e.target.value as ProfileDraft["affiliation"],
                })
              }
            >
              {affiliations.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Faculty or interest area (optional)
            <input
              maxLength={80}
              value={draft.department}
              onChange={(e) => update({ department: e.target.value })}
            />
          </label>
          <label>
            Tell visitors about yourself
            <textarea
              required
              maxLength={300}
              value={draft.about}
              onChange={(e) => update({ about: e.target.value })}
            />
          </label>
          <label>
            What are you interested in?
            <textarea
              required
              maxLength={240}
              value={draft.interests}
              onChange={(e) => update({ interests: e.target.value })}
            />
          </label>
          <label>
            What would you like visitors to know? (optional)
            <textarea
              maxLength={240}
              value={draft.advice}
              onChange={(e) => update({ advice: e.target.value })}
            />
          </label>
          <label>
            Virtual meeting area
            <select
              value={draft.zone}
              onChange={(e) =>
                update({ zone: e.target.value as ProfileDraft["zone"] })
              }
            >
              {communityZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Shirt colour
            <select
              value={draft.color}
              onChange={(e) =>
                update({ color: e.target.value as ProfileDraft["color"] })
              }
            >
              {Object.keys(shirtColors).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            I am creating my own profile. This profile represents me, I have the
            right to publish this text, and I agree to make it public in this
            independent simulation.
          </label>
          <button className={styles.primary} type="submit">
            {busy
              ? "Saving…"
              : profile
                ? "Save public profile"
                : "Publish my character"}
          </button>
        </fieldset>
      </form>
      {profile ? (
        <section>
          <h3>Remove your profile</h3>
          <p>
            This removes your public character and its stored profile and
            reports. Other people may already have copied public text.
          </p>
          {remove ? (
            <div className={styles.actions}>
              <button
                disabled={busy}
                onClick={() =>
                  void action(async () => {
                    await request("profile", "DELETE");
                    setProfile(null);
                    setDraft(blank);
                    setHidden(false);
                    setRemove(false);
                    setCode("");
                    setMessage("Your profile has been removed.");
                    onChange();
                  })
                }
              >
                Confirm removal
              </button>
              <button onClick={() => setRemove(false)}>Keep my profile</button>
            </div>
          ) : (
            <button onClick={() => setRemove(true)}>Remove my character</button>
          )}
        </section>
      ) : (
        <details>
          <summary>Manage an existing profile</summary>
          <form
            className={styles.profileForm}
            onSubmit={(e) => {
              e.preventDefault();
              void action(async () => {
                const v = await request("profile/recover", "POST", {
                  recoveryCode: recover.trim(),
                });
                setProfile(v.profile);
                setDraft(v.profile);
                setHidden(v.hidden);
                setRecover("");
                setMessage("Profile access restored in this browser.");
              });
            }}
          >
            <label>
              Private recovery code
              <input
                type="password"
                required
                autoComplete="off"
                value={recover}
                onChange={(e) => setRecover(e.target.value)}
              />
            </label>
            <button disabled={busy}>Restore access</button>
          </form>
        </details>
      )}
    </>
  );
}
export function ReportProfile({ id }: { id: string }) {
  const [open, setOpen] = useState(false),
    [reason, setReason] = useState("privacy"),
    [detail, setDetail] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  return (
    <section>
      <button onClick={() => setOpen((v) => !v)}>Report this profile</button>
      {open && (
        <form
          className={styles.profileForm}
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await request("reports", "POST", { id, reason, detail });
              setMessage(
                "Report received for review. It does not automatically remove the profile. For urgent privacy concerns, use the support link below.",
              );
              setDetail("");
            } catch (e) {
              setMessage(e instanceof Error ? e.message : "Please try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Reason
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              {["privacy", "impersonation", "harassment", "spam", "other"].map(
                (r) => (
                  <option key={r}>{r}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Details (optional)
            <textarea
              maxLength={300}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </label>
          <button disabled={busy}>Send report</button>
          <a href="mailto:info@asymmetri.co">Contact Asymmetri support</a>
          {message && <p role="status">{message}</p>}
        </form>
      )}
    </section>
  );
}
