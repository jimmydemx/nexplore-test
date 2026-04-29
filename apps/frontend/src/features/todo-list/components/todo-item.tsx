import { useState } from 'react';
import type { DutyDto } from '@nexplore-test/shared-types';
import { Button, Checkbox, Flex, Input, Popconfirm, Tag, Typography } from 'antd';

type Props = {
    duty: DutyDto;
    onChangeCompletion: ({ id, completed }: { id: string; completed: boolean }) => void;
    onDeleteDuty: (id: string) => void;
    onModifyDuty: (id: string, duty: DutyDto) => void;
    isBusy?: boolean;
};

export function TodoItem({
    duty,
    onChangeCompletion,
    onDeleteDuty,
    onModifyDuty,
    isBusy = false,
}: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(duty.name);

    const handleToggleEditing = () => {
        if (isEditing) {
            setDraftName(duty.name);
            setIsEditing(false);
            return;
        }

        setDraftName(duty.name);
        setIsEditing(true);
    };

    const handleSave = () => {
        const nextName = draftName.trim();

        if (!nextName || nextName === duty.name) {
            setIsEditing(false);
            setDraftName(duty.name);
            return;
        }

        onModifyDuty(duty.id, {
            ...duty,
            name: nextName,
        });
        setIsEditing(false);
    };

    return (
        <div className="todo-item">
            <Flex align="center" justify="space-between" gap={16} wrap>
                <Flex align="center" gap={12} className="todo-item__main">
                    <Checkbox
                        checked={duty.completed}
                        disabled={isBusy}
                        onChange={(event) =>
                            onChangeCompletion({ id: duty.id, completed: event.target.checked })
                        }
                    />

                    <div className="todo-item__content">
                        {isEditing ? (
                            <Input
                                value={draftName}
                                onChange={(event) => setDraftName(event.target.value)}
                                onPressEnter={handleSave}
                                onBlur={handleSave}
                                autoFocus
                                disabled={isBusy}
                            />
                        ) : (
                            <Typography.Text
                                className={duty.completed ? 'todo-item__name todo-item__name--completed' : 'todo-item__name'}
                            >
                                {duty.name}
                            </Typography.Text>
                        )}
                    </div>
                </Flex>

                <Flex align="center" gap={8} wrap>
                    <Tag color={duty.completed ? 'green' : 'gold'}>
                        {duty.completed ? 'Completed' : 'Active'}
                    </Tag>
                    <Button
                        type="text"
                        onClick={handleToggleEditing}
                        disabled={isBusy}
                    >
                        {isEditing ? 'Cancel' : 'Rename'}
                    </Button>
                    <Popconfirm
                        title="Delete this duty?"
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => onDeleteDuty(duty.id)}
                    >
                        <Button danger type="text" disabled={isBusy}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Flex>
            </Flex>
        </div>
    );
}