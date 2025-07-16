import React from 'react';
import { Col, Modal, Row, Tooltip, Typography } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';
import CustomButton from '../../common/CustomButton/CustomButton';

interface PropertyGroups {
    category: string;
    fields: { key: string; label: string }[];
}

interface ModalCustomPropertiesProps {
    open: boolean;
    onClose: () => void;
    onAccept: () => void;
    propertyGroups: PropertyGroups[];
    checkedKeys: string[];
    setCheckedKeys: React.Dispatch<React.SetStateAction<string[]>>;
}

const ModalCustomProperties: React.FC<ModalCustomPropertiesProps> = ({
    open,
    onClose,
    onAccept,
    propertyGroups,
    checkedKeys,
    setCheckedKeys
}) => {
    return (
        <Modal
            title={<span className="modal-title">Manage properties</span>}
            open={open}
            onCancel={onClose}
            footer={[
                <div className='footer-modal'>
                    <CustomButton className='button-modal' variant='blue' layout='noIcon' text='Accept' onClick={onAccept} />
                    <CustomButton className='button-modal' variant='white' layout='noIcon' text='Cancel' onClick={onClose} />
                </div>
            ]}
            width={1000}
            className="manage-properties-modal"
        >
            <Typography.Title level={5} className="custom-properties-title">
                <span>Custom properties</span>&nbsp;
                <Tooltip title="I don't know what to put in here.">
                    <QuestionCircleFilled style={{ fontSize: 14 }} />
                </Tooltip>
            </Typography.Title>

            <Row gutter={32}>
                {propertyGroups.map(group => (
                    <Col span={8} key={group.category}>
                        <div className="category-title">{group.category}</div>
                        {group.fields.map(f => (
                            <label key={f.key} className="field-row">
                                <input
                                    type="checkbox"
                                    checked={checkedKeys.includes(f.key)}
                                    onChange={e => {
                                        setCheckedKeys(prev =>
                                            e.target.checked
                                                ? [...prev, f.key]
                                                : prev.filter(k => k !== f.key)
                                        );
                                    }}
                                />
                                <span className="field-label">{f.label}</span>
                            </label>
                        ))}
                    </Col>
                ))}
            </Row>
        </Modal>
    );
};

export default ModalCustomProperties