import css, { Declaration, Rule } from "css";
import fs from "fs";
import path from "path";

const cssFilePath = path.join("assets", "test.css");
const importedCss = fs.readFileSync(cssFilePath, "utf-8");

function filterRules(rules: Rule[]) {
  return rules.filter((rule: Rule) => rule.type === "rule" && rule.selectors && rule.declarations) as Rule[];
}

function filterDeclarations(declarations: Declaration[]) {
  return declarations.filter((declaration) => declaration.type === "declaration" && declaration.property && declaration.value);
}

export class Css {
  protected rules?: Rule[];
  constructor(stylesheet: string) {
    this.rules = filterRules(css.parse(stylesheet).stylesheet?.rules ?? []);
  }

  public get stylesheet() {
    return this.rules;
  }

  /**
   * Get styles with a space separated class list
   * @param extraStyleStr inject extra styles to the style
   */
  styleByClass(classes: string, extraStyleStr?: string): string {
    let extraStyle: Rule[] = [];
    if (extraStyleStr) {
      extraStyle = filterRules(css.parse(extraStyleStr).stylesheet?.rules ?? []);
    }
    const internalRules = this.rules?.concat(extraStyle);
    const classList = classes.split(" ");
    const validRules = internalRules?.filter((rule) => {
      const safeSelectors = rule.selectors?.map((selector) => selector.replace(/:\w*/g, "").replace(".", ""));
      return classList.some((classname) => safeSelectors?.includes(classname));
    });
    let declarations: Declaration[] = [];
    for (const rule of validRules ?? []) {
      const filteredDeclarations = filterDeclarations(rule.declarations ?? []);
      declarations = [...declarations, ...filteredDeclarations];
    }
    return declarations.map(({ property, value }) => `${property}: ${value};`).join("\n");
  }
}
