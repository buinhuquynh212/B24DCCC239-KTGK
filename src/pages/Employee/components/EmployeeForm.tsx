import { Modal, Form, Input, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  addEmployee,
  updateEmployee,
} from '@/services/employee.service';
import {
  getPositions,
  getDepartments,
} from '@/services/category.service';
import type { Employee } from '@/types/employee';

const { Option } = Select;

// Props
interface Props {
  visible: boolean;
  onClose: () => void;
  reload: () => void;
  employee?: Employee | null; // 🔥 dùng cho edit
}

export default ({ visible, onClose, reload, employee }: Props) => {
  const [form] = Form.useForm();

  // danh mục
  const [positions, setPositions] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  // load danh mục
  useEffect(() => {
    setPositions(getPositions());
    setDepartments(getDepartments());
  }, []);

  // 🔥 set dữ liệu khi edit
  useEffect(() => {
    if (employee) {
      form.setFieldsValue(employee);
    } else {
      form.resetFields();
    }
  }, [employee, form]);

  // submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (employee) {
        // 🔥 UPDATE
        const updated: Employee = {
          ...employee,
          ...values,
          salary: Number(values.salary),
        };

        updateEmployee(updated);
        message.success('Cập nhật thành công');
      } else {
        // 🔥 ADD
        const newEmp: Employee = {
          ...values,
          salary: Number(values.salary),
          id: 'NV' + Date.now(),
        };

        addEmployee(newEmp);
        message.success('Thêm thành công');
      }

      reload();
      form.resetFields();
      onClose();
    } catch {
      message.error('Vui lòng nhập đầy đủ thông tin');
    }
  };

  return (
    <Modal
      title={employee ? 'Sửa nhân viên' : 'Thêm nhân viên'}
      visible={visible} // nếu AntD v5 → đổi thành open
      onOk={handleSubmit}
      onCancel={onClose}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {/* HỌ TÊN */}
        <Form.Item
          name="name"
          label="Họ tên"
          rules={[
            { required: true, message: 'Không được để trống' },
            { max: 50, message: 'Tối đa 50 ký tự' },
            {
              pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
              message: 'Không chứa ký tự đặc biệt',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* CHỨC VỤ */}
        <Form.Item
          name="position"
          label="Chức vụ"
          rules={[{ required: true, message: 'Chọn chức vụ' }]}
        >
          <Select placeholder="Chọn chức vụ">
            {positions.map((p) => (
              <Option key={p} value={p}>
                {p}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* PHÒNG BAN */}
        <Form.Item
          name="department"
          label="Phòng ban"
          rules={[{ required: true, message: 'Chọn phòng ban' }]}
        >
          <Select placeholder="Chọn phòng ban">
            {departments.map((d) => (
              <Option key={d} value={d}>
                {d}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* LƯƠNG */}
        <Form.Item
          name="salary"
          label="Lương"
          rules={[{ required: true, message: 'Nhập lương' }]}
        >
          <Input type="number" />
        </Form.Item>

        {/* TRẠNG THÁI */}
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="probation">Thử việc</Option>
            <Option value="official">Chính thức</Option>
            <Option value="leave">Nghỉ phép</Option>
            <Option value="resigned">Đã nghỉ</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};