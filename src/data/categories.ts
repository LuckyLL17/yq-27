import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'java',
    name: 'Java',
    icon: 'coffee',
    description: 'Java基础、并发、JVM、Spring全家桶',
    questionCount: 25,
    color: '#f89820',
  },
  {
    id: 'database',
    name: '数据库',
    icon: 'database',
    description: 'MySQL、索引优化、事务、锁机制',
    questionCount: 20,
    color: '#00758f',
  },
  {
    id: 'cache',
    name: '缓存',
    icon: 'zap',
    description: 'Redis、缓存穿透/击穿/雪崩、一致性',
    questionCount: 15,
    color: '#dc382d',
  },
  {
    id: 'mq',
    name: '消息队列',
    icon: 'message-square',
    description: 'Kafka、RabbitMQ、消息可靠性',
    questionCount: 15,
    color: '#231f20',
  },
  {
    id: 'system-design',
    name: '系统设计',
    icon: 'layout-grid',
    description: '高可用、高并发、分布式系统',
    questionCount: 10,
    color: '#6366f1',
  },
];
