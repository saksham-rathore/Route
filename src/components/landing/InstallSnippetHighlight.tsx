import {
  getBeaconScriptSrc,
  usesNextScriptComponent,
  NEXTJS_BEACON_SCRIPT_STRATEGY,
} from '@/lib/analytics/beacon-snippet';

type InstallSnippetHighlightProps = {
  scriptBaseUrl: string;
  projectId: string;
  domain: string;
  techStack: string;
  className?: string;
  codeClassName?: string;
};

const sym = 'text-[color:var(--dash-code-symbol)]';
const tag = 'text-[color:var(--dash-code-tag)]';
const attr = 'text-[color:var(--dash-code-attr)]';
const op = 'text-[color:var(--dash-code-operator)]';
const str = 'text-[color:var(--dash-code-string)] break-all';

function HtmlScriptSnippet({
  src,
  projectId,
  domain,
  codeClass,
}: {
  src: string;
  projectId: string;
  domain: string;
  codeClass: string;
}) {
  return (
    <code className={codeClass}>
      <span className={sym}>&lt;</span>
      <span className={tag}>script</span>
      {'\n'}
      <span className={attr}>  defer</span>
      {'\n'}
      <span className={attr}>  src</span>
      <span className={op}>=</span>
      <span className={str}>&quot;{src}&quot;</span>
      {'\n'}
      <span className={attr}>  data-pid</span>
      <span className={op}>=</span>
      <span className={str}>&quot;{projectId}&quot;</span>
      {'\n'}
      <span className={attr}>  data-domain</span>
      <span className={op}>=</span>
      <span className={str}>&quot;{domain}&quot;</span>
      {'\n'}
      <span className={sym}>&gt;&lt;/</span>
      <span className={tag}>script</span>
      <span className={sym}>&gt;</span>
    </code>
  );
}

function NextJsScriptSnippet({
  src,
  projectId,
  domain,
  codeClass,
}: {
  src: string;
  projectId: string;
  domain: string;
  codeClass: string;
}) {
  return (
    <code className={codeClass}>
      <span className={sym}>&lt;</span>
      <span className={tag}>Script</span>
      {'\n'}
      <span className={attr}>  src</span>
      <span className={op}>=</span>
      <span className={str}>&quot;{src}&quot;</span>
      {'\n'}
      <span className={attr}>  data-pid</span>
      <span className={op}>=</span>
      <span className={str}>&quot;{projectId}&quot;</span>
      {'\n'}
      <span className={attr}>  data-domain</span>
      <span className={op}>=</span>
      <span className={str}>&quot;{domain}&quot;</span>
      {'\n'}
      <span className={attr}>  strategy</span>
      <span className={op}>=</span>
      <span className={str}>&quot;{NEXTJS_BEACON_SCRIPT_STRATEGY}&quot;</span>
      {'\n'}
      <span className={sym}>/&gt;</span>
    </code>
  );
}

export function InstallSnippetHighlight({
  scriptBaseUrl,
  projectId,
  domain,
  techStack,
  className = '',
  codeClassName = 'text-xs sm:text-sm',
}: InstallSnippetHighlightProps) {
  const src = getBeaconScriptSrc(scriptBaseUrl, projectId, domain);
  const codeClass = `block whitespace-pre font-mono ${codeClassName}`.trim();
  const isNextJs = usesNextScriptComponent(techStack);

  return (
    <pre className={`overflow-x-auto text-[color:var(--dash-code-text)] ${className}`.trim()}>
      {isNextJs ? (
        <NextJsScriptSnippet src={src} projectId={projectId} domain={domain} codeClass={codeClass} />
      ) : (
        <HtmlScriptSnippet src={src} projectId={projectId} domain={domain} codeClass={codeClass} />
      )}
    </pre>
  );
}
