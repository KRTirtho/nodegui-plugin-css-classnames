import css, { Declaration, Rule } from "css";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

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
  styleByClass(classes: string, extraStyleStr?: string): { styleSheet: string; id: string } {
    let extraStyle: Rule[] = [];
    if (extraStyleStr) {
      extraStyle = filterRules(css.parse(extraStyleStr).stylesheet?.rules ?? []);
    }
    const internalRules = this.rules?.concat(extraStyle);
    const classList = classes.split(" ");

    const validRules: Rule[] = [];
    const validPseudoRules: Rule[] = [];

    for (const rule of internalRules ?? []) {
      const safeSelectors: string[] = [];
      const pseudoSelectors: string[] = [];
      const pseudoPattern = /:\w*/g;

      for (const selector of rule.selectors ?? []) {
        if (pseudoPattern.test(selector)) {
          pseudoSelectors.push(selector);
        } else {
          safeSelectors.push(selector.replace(".", ""));
        }
      }

      if (classList.some((classname) => safeSelectors?.includes(classname))) {
        validRules.push(rule);
      }
      const safePseudoSelector = pseudoSelectors.map((selector) => selector.replace(pseudoPattern, "").replace(".", ""));

      if (classList.some((classname) => safePseudoSelector.includes(classname))) {
        validPseudoRules.push(rule);
      }
    }
    let declarations: Declaration[] = [];
    for (const rule of validRules) {
      const filteredDeclarations = filterDeclarations(rule.declarations ?? []);
      declarations = [...declarations, ...filteredDeclarations];
    }
    let pseudoDeclarations: Declaration[] = [];
    for (const rule of validPseudoRules) {
      const filteredDeclarations = filterDeclarations(rule.declarations ?? []);
      pseudoDeclarations = [...pseudoDeclarations, ...filteredDeclarations];
    }
    const id = uuid();
    const styleSheet = `#${id}{\n${declarations.map(({ property, value }) => `${property}: ${value};`).join("\n")}\n}\n#${id}-pseudo{\n${pseudoDeclarations
      .map(({ property, value }) => `${property}: ${value};`)
      .join("\n")}\n}`;
    return { styleSheet, id };
  }
}

const x = new Css(importedCss);
console.log(x.styleByClass("bottom-nav"));
