import Copilot from '@/components/Copilot';
import { Image } from 'antd';
import { createStyles } from 'antd-style';
import { useState } from 'react';

const useWorkareaStyle = createStyles(({ token, css }) => {
  return {
    copilotWrapper: css`
      min-width: 1000px;
      height: 100vh;
      display: flex;
    `,
    workarea: css`
      flex: 1;
      background: ${token.colorBgLayout};
      display: flex;
      flex-direction: column;
    `,
    workareaHeader: css`
      box-sizing: border-box;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 48px 0 28px;
      border-bottom: 1px solid ${token.colorBorder};
    `,
    headerTitle: css`
      font-weight: 600;
      font-size: 15px;
      color: ${token.colorText};
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    headerButton: css`
      background-image: linear-gradient(78deg, #8054f2 7%, #3895da 95%);
      border-radius: 12px;
      height: 24px;
      width: 93px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s;
      &:hover {
        opacity: 0.8;
      }
    `,
    workareaBody: css`
      flex: 1;
      padding: 16px;
      background: ${token.colorBgContainer};
      border-radius: 16px;
      min-height: 0;
    `,
    bodyContent: css`
      // overflow: auto;
      height: 100%;
      padding-right: 10px;
    `,
    bodyText: css`
      color: ${token.colorText};
      padding: 8px;
    `,
  };
});

const CopilotDemo = () => {
  const { styles: workareaStyles } = useWorkareaStyle();

  // ==================== State =================
  const [copilotOpen, setCopilotOpen] = useState(true);

  // ==================== Render =================
  return (
    <div className={workareaStyles.copilotWrapper}>
      {/** 左侧工作区 */}
      <div className={workareaStyles.workarea}>
        <div className={workareaStyles.workareaHeader}>
          <div className={workareaStyles.headerTitle}>
            <img
              src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
              draggable={false}
              alt="logo"
              width={20}
              height={20}
            />
            Ant Design X
          </div>
          {!copilotOpen && (
            <div onClick={() => setCopilotOpen(true)} className={workareaStyles.headerButton}>
              ✨ AI Copilot
            </div>
          )}
        </div>

        <div
          className={workareaStyles.workareaBody}
          style={{ margin: copilotOpen ? 16 : '16px 48px' }}
        >
          <div className={workareaStyles.bodyContent}>
            <Image
              src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*48RLR41kwHIAAAAAAAAAAAAADgCCAQ/fmt.webp"
              preview={false}
            />
            <div className={workareaStyles.bodyText}>
              <h4>What is the RICH design paradigm?</h4>
              <div>
                RICH is an AI interface design paradigm we propose, similar to how the WIMP paradigm
                relates to graphical user interfaces.
              </div>
              <br />
              <div>
                The ACM SIGCHI 2005 (the premier conference on human-computer interaction) defined
                that the core issues of human-computer interaction can be divided into three levels:
              </div>
              <ul>
                <li>
                  Interface Paradigm Layer: Defines the design elements of human-computer
                  interaction interfaces, guiding designers to focus on core issues.
                </li>
                <li>
                  User model layer: Build an interface experience evaluation model to measure the
                  quality of the interface experience.
                </li>
                <li>
                  Software framework layer: The underlying support algorithms and data structures
                  for human-computer interfaces, which are the contents hidden behind the front-end
                  interface.
                </li>
              </ul>
              <div>
                The interface paradigm is the aspect that designers need to focus on and define the
                most when a new human-computer interaction technology is born. The interface
                paradigm defines the design elements that designers should pay attention to, and
                based on this, it is possible to determine what constitutes good design and how to
                achieve it.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/** 右侧对话区 */}
      <Copilot copilotOpen={copilotOpen} setCopilotOpen={setCopilotOpen} />
    </div>
  );
};

export default CopilotDemo;
