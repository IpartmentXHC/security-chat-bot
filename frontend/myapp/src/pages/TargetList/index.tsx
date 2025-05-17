import Copilot from '@/components/Copilot';
import { NetworkGraph, type NetworkGraphOptions } from '@ant-design/graphs';
import { ProList } from '@ant-design/pro-components';
import type { DescriptionsProps } from 'antd';
import { Descriptions, Drawer, Tag } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';

const useWorkareaStyle = createStyles(({ token, css }) => {
  return {
    copilotWrapper: css`
      min-width: 1000px;
      height: 100%;
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

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'UserName',
    children: 'Zhou Maomao',
  },
  {
    key: '2',
    label: 'Telephone',
    children: '1810000000',
  },
  {
    key: '3',
    label: 'Live',
    children: 'Hangzhou, Zhejiang',
  },
  {
    key: '4',
    label: 'Address',
    span: 2,
    children: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
  },
  {
    key: '5',
    label: 'Remark',
    children: 'empty',
  },
];

export default () => {
  const [cardActionProps, setCardActionProps] = useState<'actions' | 'extra'>('extra');

  const [ghost, setGhost] = useState<boolean>(false);
  const [data, setData] = React.useState();
  const [copilotOpen, setCopilotOpen] = useState(true);
  const { styles: workareaStyles } = useWorkareaStyle();
  const [detail, setDetail] = useState(false);

  const showDrawer = () => {
    setDetail(true);
  };

  const onClose = () => {
    setDetail(false);
  };
  useEffect(() => {
    fetch('https://assets.antv.antgroup.com/g6/graph.json')
      .then((res) => res.json())
      .then(setData);
  }, []);
  const options: NetworkGraphOptions = {
    containerStyle: { height: '400px' },
    autoFit: 'view',
    data,
    node: {
      style: {
        labelText: (d) => d.id,
        labelMaxWidth: '300%',
        labelWordWrap: true,
        labelMaxLines: 3,
      },
      state: {
        active: {
          labelMaxWidth: '1000%',
        },
      },
      palette: {
        field: 'group',
        color: ['#D580FF', '#4292C6'],
      },
    },
    behaviors: (behaviors) => [...behaviors, 'hover-activate'],
    animation: false,
  };

  const dataList = [
    '语雀的天空',
    'Ant Design',
    '蚂蚁金服体验科技',
    'TechUI',
    'TechUI 2.0',
    'Bigfish',
    'Umi',
    'Ant Design Pro',
  ].map((item) => ({
    title: item,
    subTitle: <Tag color="#5BD8A6">语雀专栏</Tag>,
    actions: [
      <a key="run" onClick={showDrawer}>
        detail
      </a>,
    ],
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    content: (
      <div
        style={{
          flex: 1,
        }}
      >
        <Descriptions title="User Info" layout="vertical" items={items} />
        <div style={{ marginTop: 16 }}></div>
      </div>
    ),
  }));

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
          <ProList<any>
            ghost={ghost}
            itemCardProps={{
              ghost,
            }}
            pagination={{
              defaultPageSize: 4,
              showSizeChanger: true,
            }}
            showActions="hover"
            grid={{ gutter: 16, column: 2 }}
            metas={{
              title: {},
              subTitle: {},
              type: {},
              avatar: {},
              content: {},
              actions: {
                cardActionProps,
              },
            }}
            dataSource={dataList}
          />
        </div>
      </div>
      {/** 右侧对话区 */}
      <Copilot copilotOpen={copilotOpen} setCopilotOpen={setCopilotOpen} />
      <Drawer width={600} onClose={onClose} open={detail} closable={false}>
        <NetworkGraph {...options} />
      </Drawer>
    </div>
  );
};
