import { useState } from 'react';
import { Alert, Card, Empty, Input, List, Space, Statistic, Typography } from 'antd';
import type { DutyDto } from '@nexplore-test/shared-types';
import { TodoItem } from '../features/todo-list/components/todo-item';
import { useDutiesQuery } from '../features/todo-list/hooks/use-duites-query';
import { useDutyMutations } from '../features/todo-list/hooks/use-duty-mutate';
import './todo-list-page.css';

export function TodoListPage() {
    const [draftName, setDraftName] = useState('');
    const [createInputBoxError, setCreateInputBoxError] = useState('');
    const { duties, isLoading, isError, error } = useDutiesQuery();
    const {
        createDuty,
        deleteDuty,
        modifyDuty,
        setDutyCompletion,
        isCreating,
        isDeleting,
        isModifying,
        isSettingCompletion,
    } = useDutyMutations();

    const completedCount = duties.filter((duty) => duty.completed).length;
    const pendingCount = duties.length - completedCount;

    const handleCreateDuty = async (value: string) => {
        const nextName = value.trim();

        if (!nextName) {
            setCreateInputBoxError('Duty name cannot be empty.');
            return;
        }

        try {
            setCreateInputBoxError('');
            await createDuty({ name: nextName });
            setDraftName('');
        } catch (createError) {
            setCreateInputBoxError(
                createError instanceof Error ? createError.message : 'Unable to create duty.',
            );
        }
    };

    const handleModifyDuty = async (id: string, duty: DutyDto) => {
        await modifyDuty({ id, duty });
    };

    const errorMessage = error instanceof Error ? error.message : 'Unable to load duties right now.';


    return (
        <div className="todo-page">
            <Card className="todo-page__card" variant="outlined">
                <Space orientation="vertical" size={24} className="todo-page__stack">
                    <div className="todo-page__hero">
                        <div>
                            <Typography.Title level={2} className="todo-page__title">
                                Todo List
                            </Typography.Title>
                        </div>

                        <div className="todo-page__stats">
                            <Card size="small" className="todo-page__stat">
                                <Statistic title="All" value={duties.length} />
                            </Card>
                            <Card size="small" className="todo-page__stat">
                                <Statistic title="Done" value={completedCount} />
                            </Card>
                            <Card size="small" className="todo-page__stat">
                                <Statistic title="Pending" value={pendingCount} />
                            </Card>
                        </div>
                    </div>

                    <Input.Search
                        size="large"
                        enterButton="Add duty"
                        placeholder="Add a new duty"
                        status={createInputBoxError ? 'error' : undefined}
                        value={draftName}
                        onChange={(event) => {
                            setDraftName(event.target.value);
                            setCreateInputBoxError('');
                        }}
                        onSearch={(value) => {
                            void handleCreateDuty(value);
                        }}
                        loading={isCreating}
                    />

                    {createInputBoxError ? (
                        <Typography.Text type="danger">{createInputBoxError}</Typography.Text>
                    ) : null}

                    {isError ? <Alert type="error" showIcon message="Request failed" description={errorMessage} /> : null}

                    <List
                        className="todo-page__list"
                        loading={isLoading}
                        dataSource={duties}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No duties yet. Add the first one above."
                                />
                            ),
                        }}
                        renderItem={(item) => (
                            <List.Item className="todo-page__list-item">
                                <TodoItem
                                    duty={item}
                                    onChangeCompletion={(input) => {
                                        void setDutyCompletion(input);
                                    }}
                                    onDeleteDuty={(id) => {
                                        void deleteDuty(id);
                                    }}
                                    onModifyDuty={handleModifyDuty}
                                    isBusy={isDeleting || isModifying || isSettingCompletion}
                                />
                            </List.Item>
                        )}
                    />
                </Space>
            </Card>
        </div>
    );
}

