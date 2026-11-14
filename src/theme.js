import {EditorView} from '@codemirror/view';
import {HighlightStyle,syntaxHighlighting} from '@codemirror/language';
import {tags} from '@lezer/highlight';

const highlighting=syntaxHighlighting(HighlightStyle.define([
  {tag:tags.keyword,color:'var(--syntax-keyword)'},
  {tag:[tags.atom,tags.bool,tags.number],color:'var(--syntax-number)'},
  {tag:[tags.string,tags.character],color:'var(--syntax-string)'},
  {tag:tags.comment,color:'var(--syntax-comment)'},
  {tag:[tags.typeName,tags.className],color:'var(--syntax-type)'},
  {tag:[tags.function(tags.variableName),tags.function(tags.propertyName)],color:'var(--syntax-function)'},
  {tag:[tags.meta,tags.operator],color:'var(--syntax-operator)'},
  {tag:tags.invalid,color:'var(--red)',textDecoration:'underline'}
]));

export function editorTheme(dark){return [EditorView.theme({
  '&':{color:'var(--ink)',backgroundColor:'var(--surface)'},
  '.cm-content':{caretColor:'var(--ink)'},
  '.cm-cursor, .cm-dropCursor':{borderLeftColor:'var(--ink)'},
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground':{backgroundColor:'var(--selection)'},
  '.cm-panels, .cm-tooltip':{color:'var(--ink)',backgroundColor:'var(--surface-alt)',borderColor:'var(--line)'},
  '.cm-tooltip-autocomplete > ul > li[aria-selected]':{color:'var(--ink)',backgroundColor:'var(--blue-tint)'},
  '.cm-searchMatch':{backgroundColor:'var(--search-match)',outline:'1px solid var(--blue-border)'},
  '.cm-searchMatch.cm-searchMatch-selected':{backgroundColor:'var(--selection)'},
  '&.cm-focused .cm-matchingBracket':{backgroundColor:'var(--blue-tint)',outline:'1px solid var(--blue-border)'},
  '.cm-foldPlaceholder':{backgroundColor:'var(--surface-alt)',color:'var(--muted)',borderColor:'var(--line)'}
},{dark}),highlighting];}
