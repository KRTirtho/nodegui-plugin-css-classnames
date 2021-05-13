import { Declaration, Rule } from "css";

export function filterRules(rules: Rule[]) {
  return rules.filter((rule: Rule) => rule.type === "rule" && rule.selectors && rule.declarations) as Rule[];
}

export function filterDeclarations(declarations: Declaration[]) {
  return declarations.filter((declaration) => declaration.type === "declaration" && declaration.property && declaration.value);
}
