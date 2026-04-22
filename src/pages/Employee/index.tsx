import {
  Table,
  Input,
  Select,
  Button,
  message,
  Popconfirm,
  Row,
  Col,
  Tag,
  Modal,
  Form,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  getEmployees,
  deleteEmployee,
} from '@/services/employee.service';
import {
  getPositions,
  getDepartments,
} from '@/services/category.service';
import type { Employee } from '@/types/employee';
import EmployeeForm from './components/EmployeeForm';
import {
  FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Option } = Select;

export default () => {
  const [data, setData] = useState<Employee[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //  danh mục động
  const [positions, setPositions] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  //  filter state
  const [filter, setFilter] = useState<{
    position?: string;
    department?: string;
  }>({});

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterForm] = Form.useForm();

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadData();
    setPositions(getPositions());
    setDepartments(getDepartments());
  }, []);

  // load data
  const loadData = () => {
    const list = getEmployees();
    setData([...list]);
  };

  // delete
  const handleDelete = (record: Employee) => {
    if (
      record.status !== 'probation' &&
      record.status !== 'resigned'
    ) {
      message.error('Chỉ được xóa nhân viên thử việc hoặc đã nghỉ');
      return;
    }

    deleteEmployee(record.id);
    message.success('Xóa thành công');
    loadData();
  };

  // columns
  const columns = [
    { title: 'Mã NV', dataIndex: 'id' },
    { title: 'Họ tên', dataIndex: 'name' },
    { title: 'Chức vụ', dataIndex: 'position' },
    { title: 'Phòng ban', dataIndex: 'department' },
    {
      title: 'Lương',
      dataIndex: 'salary',
      sorter: (a: Employee, b: Employee) => b.salary - a.salary,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: Employee['status']) => {
        const colorMap: Record<string, string> = {
          probation: 'orange',
          official: 'green',
          leave: 'blue',
          resigned: 'red',
        };

        const textMap: Record<string, string> = {
          probation: 'Thử việc',
          official: 'Chính thức',
          leave: 'Nghỉ phép',
          resigned: 'Đã nghỉ',
        };

        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
      },
    },
    {
      title: 'Action',
      render: (_: any, record: Employee) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingEmployee(record);
              setIsModalOpen(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  //  filter + search
  const filteredData = data.filter((e) => {
    return (
      (e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.id.toLowerCase().includes(search.toLowerCase())) &&
      (filter.position ? e.position === filter.position : true) &&
      (filter.department ? e.department === filter.department : true)
    );
  });

  return (
    <div>
      <h2>Quản lý nhân viên</h2>

      {/* ACTION */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Tìm kiếm theo mã hoặc tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
        </Col>

        {/* FILTER */}
        <Col>
          <Button
            icon={<FilterOutlined />}
            onClick={() => setIsFilterOpen(true)}
          >
            Lọc
          </Button>
        </Col>

        {/* RESET */}
        <Col>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setFilter({});
              filterForm.resetFields();
            }}
          >
            Reset
          </Button>
        </Col>

        {/* ADD */}
        <Col>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            + Thêm nhân viên
          </Button>
        </Col>
      </Row>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
      />

      {/* MODAL THÊM */}
      <EmployeeForm
        visible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null); // reset
        }}
        reload={loadData}
        employee={editingEmployee}
      />

      {/*  MODAL FILTER */}
      <Modal
        title="Lọc nhân viên"
        visible={isFilterOpen} // nếu AntD v5 → dùng open
        onOk={() => {
          const values = filterForm.getFieldsValue();
          setFilter(values);
          setIsFilterOpen(false);
        }}
        onCancel={() => setIsFilterOpen(false)}
      >
        <Form form={filterForm} layout="vertical">
          <Form.Item name="position" label="Chức vụ">
            <Select allowClear placeholder="Chọn chức vụ">
              {positions.map((p) => (
                <Option key={p} value={p}>
                  {p}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="department" label="Phòng ban">
            <Select allowClear placeholder="Chọn phòng ban">
              {departments.map((d) => (
                <Option key={d} value={d}>
                  {d}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};