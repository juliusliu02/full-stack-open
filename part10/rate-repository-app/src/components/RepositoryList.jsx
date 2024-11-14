import { FlatList, Pressable, View } from 'react-native';
import RepositoryItem from "./RepositoryItem";
import useRepositories from '../hooks/useRepositories';
import { useNavigate } from "react-router-native";
import ItemSeparator from "./ItemSeparator";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from 'react-native-paper';
import { useDebounce } from "use-debounce";
import { Menu, PaperProvider } from 'react-native-paper';
import Text from "./Text";

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 20,
  },
})

const SelectMenu = ({order, setOrder}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const map = (order) => {
    switch (order) {
      case 'latest' : return 'Latest repositories';
      case 'highest' : return 'Highest rated repositories';
      case 'lowest' : return 'Lowest rated repositories';
      default: return 'Latest repositories';
    }
  }

  return (
    <PaperProvider>
      <View
        style={styles.container}>
        <Menu
          theme={{colors: {
            elevation: {
              level2: 'white'
            }
          }}}
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Pressable onPress={openMenu}>
            <Text>Order by: {map(order)}</Text>
          </Pressable>}
          anchorPosition='top'
        >
          <Menu.Item onPress={() => {
            setOrder('latest')
            closeMenu()
          }} title="Latest repositories" />
          <Menu.Item onPress={() => {
            setOrder('highest')
            closeMenu()
          }} title="Highest rated repositories" />
          <Menu.Item onPress={() => {
            setOrder('lowest')
            closeMenu()
          }} title="Lowest rated repositories" />
        </Menu>
      </View>
    </PaperProvider>
  );
}

const RepositoryListHeader = ({order, setOrder, filter, setFilter}) => {
  return (<View>
    <Searchbar placeholder='Search' value={filter} onChangeText={setFilter} style={{backgroundColor: 'inherit'}} />
    <SelectMenu order={order} setOrder={setOrder}/>
  </View>)
}

export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    const { order, setOrder, filter, setFilter } = this.props;
    return (
      RepositoryListHeader({ order, setOrder, filter, setFilter })
    );
  };

  render() {
    const { repositories, navigate, onEndReach } = this.props;

    const repositoryNodes = repositories
      ? repositories.edges.map(edge => edge.node)
      : [];

    return (
      <FlatList
        data={repositoryNodes}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={this.renderHeader}
        ListHeaderComponentStyle={{zIndex: 10}}
        onEndReached={onEndReach}
        onEndReachedThreshold={0.5}
        renderItem={(item) => (
          <Pressable onPress={() => navigate(`/repo/${item.item.id}`)}>
            <RepositoryItem item={item.item}/>
          </Pressable>
        )}/>
    );
  }
}

const RepositoryList = () => {
  const [order, setOrder] = useState('');
  const [filter, setFilter] = useState('');
  const [query] = useDebounce(filter, 500);
  const navigate = useNavigate();
  const { repositories, fetchMore } = useRepositories(order, query);

  const onEndReach = () => {
    fetchMore()
  };

  return <RepositoryListContainer
    repositories={repositories}
    onEndReach={onEndReach}
    order={order}
    setOrder={setOrder}
    filter={filter}
    setFilter={setFilter}
    navigate={navigate}
  />;
};

export default RepositoryList;