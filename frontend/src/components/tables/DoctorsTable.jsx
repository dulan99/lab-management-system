import React ,{ useState} from 'react';
import { Table, Button, ConfigProvider, Empty, Tag, Modal } from 'antd';
import DoctorCreateModal from '../modal/DoctorCreateModal';

const columns = [
    {
        title: 'Doctor Name',
        dataIndex: ['name'],
    },
    {
        title: 'Email',
        dataIndex: ['email'],
    },
    {
        title: 'Specialization',
        dataIndex: ['specialization'],
    },
    {
        title: 'Experience',
        dataIndex: ['experience'],
    },
    {
        title: 'Edit',
        dataIndex: 'edit',
        render: (_, record) => (
            <Button type='primary' onClick={}>
                Edit
            </Button>
        ),
    },
    {
        title: 'Delete',
        dataIndex: 'delete',
        render: (_, record) => (
            <Button danger>
                Delete
            </Button>
        ),
    },
];

const DoctorsTable = ({ doctors, loading }) => {

    const [openModal, setOpenModal] = useState(false);

    return (
        <div>
            <ConfigProvider renderEmpty={() => <Empty description="No Schedules Found" />}>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={doctors}
                    pagination={{ defaultPageSize: 4, position: ['bottomCenter'] }}
                />
            </ConfigProvider>
            {}
            <DoctorCreateModal />
        </div>
    );
};

export default DoctorsTable;
