const css = (arg: TemplateStringsArray, ...args: any[]) => arg + args.join(" ");
export const stylesheet = css`
  .mx-3 {
    margin-horizontal: 20px;
  }
  .px-2 {
    padding-horizontal: 10px;
  }
  .pr-3 {
    padding-right: 20px;
  }
  .d-flex {
    flex: 1;
  }
  .justify-space-around{
    justify-content: "space-around";
  }
  .welcome-text {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: "AlignHCenter";
    font-family: "sans-serif";
  }
  .step-1 {
    font-size: 18px;
    padding-top: 10px;
    padding-horizontal: 20px;
  }
  .button {
    background-color: #008b8b;
    color: #ff00ff;
  }
  .button:hover {
    background-color: #008b0c;
  }
`;
