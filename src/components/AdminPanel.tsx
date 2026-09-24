import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserManager } from './UserManager';

type AdminSection = 'dashboard' | 'rules' | 'usage' | 'users' | 'activity';

export function AdminPanel() {
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [usage, setUsage] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [finalRules, setFinalRules] = useState<any[]>([]);
const [overtimeRules, setOvertimeRules] = useState<any[]>([]);
const [form1099Rules, setForm1099Rules] = useState<any[]>([]);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editingRuleJson, setEditingRuleJson] = useState('');
  const [savingRule, setSavingRule] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setLoading(true);

    const [
  usageResult,
  activityResult,
  finalResult,
  overtimeResult,
  form1099Result
] = await Promise.all([
  supabase
    .from('calculator_usage')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50),

  supabase
    .from('user_activity')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50),

  supabase
    .from('final_paycheck_rules')
    .select('*')
    .order('state_code'),

  supabase
    .from('overtime_rules')
    .select('*')
    .order('state_code'),

  supabase
    .from('form_1099_rules')
    .select('*')
    .order('tax_year')
]);

setUsage(usageResult.data || []);
setActivity(activityResult.data || []);
setFinalRules(finalResult.data || []);
setOvertimeRules(overtimeResult.data || []);
setForm1099Rules(form1099Result.data || []);
setLoading(false);
  }

    function startEditingRule(rule: any) {
    setEditingRuleId(rule.id);
    setEditingRuleJson(JSON.stringify(rule.rule_data ?? {}, null, 2));
  }

  function cancelEditingRule() {
    setEditingRuleId(null);
    setEditingRuleJson('');
  }

  async function saveFinalPaycheckRule(ruleId: string) {
      async function saveOvertimeRule(ruleId: string) {
    setSavingRule(true);

    try {
      const parsedRule = JSON.parse(editingRuleJson);

      const { error } = await supabase
        .from('overtime_rules')
        .update({
          rule_data: parsedRule,
        })
        .eq('id', ruleId);

      if (error) {
        throw error;
      }

      setOvertimeRules((currentRules) =>
        currentRules.map((rule) =>
          rule.id === ruleId
            ? { ...rule, rule_data: parsedRule }
            : rule
        )
      );

      cancelEditingRule();
    } catch (error) {
      console.error('Failed to save overtime rule:', error);
      alert(
        'Could not save this overtime rule. Make sure the JSON is valid and try again.'
      );
    } finally {
      setSavingRule(false);
    }
  }
    setSavingRule(true);

    try {
      const parsedRule = JSON.parse(editingRuleJson);

      const { error } = await supabase
        .from('final_paycheck_rules')
        .update({
          rule_data: parsedRule,
        })
        .eq('id', ruleId);

      if (error) {
        throw error;
      }

      setFinalRules((currentRules) =>
        currentRules.map((rule) =>
          rule.id === ruleId
            ? { ...rule, rule_data: parsedRule }
            : rule
        )
      );

      cancelEditingRule();
    } catch (error) {
      console.error('Failed to save final paycheck rule:', error);
      alert(
        'Could not save this rule. Make sure the JSON is valid and try again.'
      );
    } finally {
      setSavingRule(false);
    }
  }

   async function saveOvertimeRule(ruleId: string) {
    setSavingRule(true);

    try {
      const parsedRule = JSON.parse(editingRuleJson);

      const { error } = await supabase
        .from('overtime_rules')
        .update({
          rule_data: parsedRule,
        })
        .eq('id', ruleId);

      if (error) {
        throw error;
      }

      setOvertimeRules((currentRules) =>
        currentRules.map((rule) =>
          rule.id === ruleId
            ? { ...rule, rule_data: parsedRule }
            : rule
        )
      );

      cancelEditingRule();
    } catch (error) {
      console.error('Failed to save overtime rule:', error);
      alert(
        'Could not save this overtime rule. Make sure the JSON is valid and try again.'
      );
    } finally {
      setSavingRule(false);
    }
  }
    async function saveForm1099Rule(ruleId: string) {
    setSavingRule(true);

    try {
      const parsedRule = JSON.parse(editingRuleJson);

      const { error } = await supabase
        .from('form_1099_rules')
        .update({
          rule_data: parsedRule,
        })
        .eq('id', ruleId);

      if (error) {
        throw error;
      }

      setForm1099Rules((currentRules) =>
        currentRules.map((rule) =>
          rule.id === ruleId
            ? { ...rule, rule_data: parsedRule }
            : rule
        )
      );

      cancelEditingRule();
    } catch (error) {
      console.error('Failed to save 1099 rule:', error);
      alert(
        'Could not save this 1099 rule. Make sure the JSON is valid and try again.'
      );
    } finally {
      setSavingRule(false);
    }
  }
  const menu = [
    ['dashboard', 'Dashboard'],
    ['rules', 'Rules / Data'],
    ['usage', 'Calculator Usage'],
    ['users', 'Users'],
    ['activity', 'User Activity'],
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Manage Employer Rules data, users and activity.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {menu.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSection(key)}
            className={`rounded-xl px-4 py-2 font-medium transition ${
              section === key
                ? 'bg-[#FF6200] text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
          Loading admin data...
        </div>
      ) : (
        <>
          {section === 'dashboard' && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border p-6">
                <p className="text-sm text-neutral-500">Calculator Usage</p>
                <p className="mt-2 text-3xl font-bold">{usage.length}</p>
              </div>

              <div className="rounded-2xl border p-6">
                <p className="text-sm text-neutral-500">User Activity</p>
                <p className="mt-2 text-3xl font-bold">{activity.length}</p>
              </div>

              <div className="rounded-2xl border p-6">
                <p className="text-sm text-neutral-500">System</p>
                <p className="mt-2 text-3xl font-bold">Online</p>
              </div>
            </div>
          )}

         {section === 'rules' && (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold">Rules / Data Manager</h2>
      <p className="mt-1 text-neutral-500">
        Rules currently stored in Supabase.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border p-5">
        <p className="text-sm text-neutral-500">Final Paycheck</p>
        <p className="mt-1 text-3xl font-bold">{finalRules.length}</p>
        <p className="text-sm text-neutral-500">state rules</p>
      </div>

      <div className="rounded-2xl border p-5">
        <p className="text-sm text-neutral-500">Overtime</p>
        <p className="mt-1 text-3xl font-bold">{overtimeRules.length}</p>
        <p className="text-sm text-neutral-500">rule records</p>
      </div>

      <div className="rounded-2xl border p-5">
        <p className="text-sm text-neutral-500">1099</p>
        <p className="mt-1 text-3xl font-bold">{form1099Rules.length}</p>
        <p className="text-sm text-neutral-500">tax-year records</p>
      </div>
    </div>

        <div className="rounded-2xl border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Final Paycheck Rules
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Edit the rule data stored in Supabase.
        </p>
      </div>

      <div className="space-y-3">
        {finalRules.map((rule) => (
          <div
            key={rule.id}
            className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800"
          >
            {editingRuleId === rule.id ? (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">
                    {rule.rule_data?.stateName || rule.state_code}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {rule.state_code}
                  </p>
                </div>

                <textarea
                  value={editingRuleJson}
                  onChange={(event) =>
                    setEditingRuleJson(event.target.value)
                  }
                  className="min-h-[320px] w-full rounded-xl border border-neutral-300 bg-white p-4 font-mono text-sm text-neutral-900 outline-none focus:border-[#FF6200] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                  spellCheck={false}
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveFinalPaycheckRule(rule.id)}
                    disabled={savingRule}
                    className="rounded-xl bg-[#FF6200] px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                  >
                    {savingRule ? 'Saving...' : 'Save Rule'}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditingRule}
                    disabled={savingRule}
                    className="rounded-xl bg-neutral-200 px-4 py-2 font-medium text-neutral-800 transition hover:bg-neutral-300 disabled:opacity-50 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">
                    {rule.rule_data?.stateName || rule.state_code}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {rule.state_code}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>

                  <button
                    type="button"
                    onClick={() => startEditingRule(rule)}
                    className="rounded-xl bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

        <div className="rounded-2xl border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Overtime Rules
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Edit the overtime rule data stored in Supabase.
        </p>
      </div>

      <div className="space-y-3">
        {overtimeRules.map((rule) => (
          <div
            key={rule.id}
            className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800"
          >
            {editingRuleId === rule.id ? (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">{rule.state_code}</p>
                </div>

                <textarea
                  value={editingRuleJson}
                  onChange={(event) =>
                    setEditingRuleJson(event.target.value)
                  }
                  className="min-h-[320px] w-full rounded-xl border border-neutral-300 bg-white p-4 font-mono text-sm text-neutral-900 outline-none focus:border-[#FF6200] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                  spellCheck={false}
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveOvertimeRule(rule.id)}
                    disabled={savingRule}
                    className="rounded-xl bg-[#FF6200] px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                  >
                    {savingRule ? 'Saving...' : 'Save Rule'}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditingRule}
                    disabled={savingRule}
                    className="rounded-xl bg-neutral-200 px-4 py-2 font-medium text-neutral-800 transition hover:bg-neutral-300 disabled:opacity-50 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{rule.state_code}</p>
                  <p className="text-sm text-neutral-500">
                    Overtime rule
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => startEditingRule(rule)}
                  className="rounded-xl bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

        <div className="rounded-2xl border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          1099 Tax Years
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Edit the 1099 rule data stored in Supabase.
        </p>
      </div>

      <div className="space-y-3">
        {form1099Rules.map((rule) => (
          <div
            key={rule.id}
            className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800"
          >
            {editingRuleId === rule.id ? (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">{rule.tax_year}</p>
                  <p className="text-sm text-neutral-500">
                    1099 tax-year rule
                  </p>
                </div>

                <textarea
                  value={editingRuleJson}
                  onChange={(event) =>
                    setEditingRuleJson(event.target.value)
                  }
                  className="min-h-[320px] w-full rounded-xl border border-neutral-300 bg-white p-4 font-mono text-sm text-neutral-900 outline-none focus:border-[#FF6200] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                  spellCheck={false}
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveForm1099Rule(rule.id)}
                    disabled={savingRule}
                    className="rounded-xl bg-[#FF6200] px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                  >
                    {savingRule ? 'Saving...' : 'Save Rule'}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditingRule}
                    disabled={savingRule}
                    className="rounded-xl bg-neutral-200 px-4 py-2 font-medium text-neutral-800 transition hover:bg-neutral-300 disabled:opacity-50 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{rule.tax_year}</p>
                  <p className="text-sm text-neutral-500">
                    1099 tax-year rule
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => startEditingRule(rule)}
                  className="rounded-xl bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)}

          {section === 'usage' && (
            <div className="rounded-2xl border p-6">
              <h2 className="mb-4 text-xl font-semibold">Calculator Usage</h2>

              {usage.length === 0 ? (
                <p className="text-neutral-500">No calculator usage recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {usage.map((item) => (
                    <div key={item.id} className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800">
                      {item.calculator} {item.state_code && `• ${item.state_code}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'users' && <UserManager />}

          {section === 'activity' && (
            <div className="rounded-2xl border p-6">
              <h2 className="mb-4 text-xl font-semibold">User Activity</h2>

              {activity.length === 0 ? (
                <p className="text-neutral-500">No activity recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {activity.map((item) => (
                    <div key={item.id} className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800">
                      {item.activity_type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}