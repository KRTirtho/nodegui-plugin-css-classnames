import css, { Declaration, Rule } from "css";
import { v4 as uuid } from "uuid";
import { filterDeclarations, filterRules } from "./util/filters";

const pseudoPattern = /:{1,2}\w*/gi;
export class Css {
  protected rules?: Rule[];
  constructor(stylesheet: string) {
    this.rules = filterRules(css.parse(stylesheet).stylesheet?.rules ?? []);
  }

  public get stylesheet() {
    return this.rules;
  }

  categorizePseudoSelectors(rules: Rule[]): { [key: string]: Rule[] } {
    let pseudoObj: { [key: string]: Rule[] } = {};
    for (const rule of rules) {
      const safeSelectors = rule.selectors?.filter((selector) => /:{1,2}\w*/gi.test(selector));
      for (const selector of safeSelectors ?? []) {
        const pseudoElements = selector.match(pseudoPattern)?.join("");
        if (pseudoElements) {
          pseudoObj[pseudoElements] = [...(pseudoObj[pseudoElements] ?? []), rule];
        }
      }
    }
    return pseudoObj;
  }

  /**
   * Get styles with a space separated class list
   * @param extraStyleStr inject extra styles to the stylesheet
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
    const categorizedPseudoRules = this.categorizePseudoSelectors(validPseudoRules);
    let declarations: Declaration[] = [];
    for (const rule of validRules) {
      const filteredDeclarations = filterDeclarations(rule.declarations ?? []);
      declarations = [...declarations, ...filteredDeclarations];
    }

    let categorizedPseudoDeclarations: string[] = [];

    const id = uuid();
    for (const category in categorizedPseudoRules) {
      let pseudoDeclarations: Declaration[] = [];
      // now signifying the categories
      for (const rule of categorizedPseudoRules[category]) {
        const filteredDeclarations = filterDeclarations(rule.declarations ?? []);
        pseudoDeclarations = [...pseudoDeclarations, ...filteredDeclarations];
      }
      const styles = pseudoDeclarations.map(({ property, value }) => `${property}: ${value};`).join("\n");
      categorizedPseudoDeclarations.push(`#${id}${category}{\n${styles}\n}`);
    }

    const styleSheet = `#${id}{\n${declarations.map(({ property, value }) => `${property}: ${value};`).join("\n")}\n}\n${categorizedPseudoDeclarations.join("\n")}`;
    return { styleSheet, id };
  }
}
